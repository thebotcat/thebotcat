let commonConstants = require('./constants');

module.exports = class PingChecker {
  #pingDomain;
  #pingMinDelayMsecs;
  #pingSocketDestroyTimeoutMscs;
  #lastCheckEnd = null;
  #requestBatching = false;
  #batchedRequests = [];
  
  constructor({
    pingDomain = commonConstants.PING_TEST_DOMAIN,
    pingMinDelayMsecs = commonConstants.PING_MIN_DELAY_MSECS,
    pingSocketDestroyTimeoutMscs = commonConstants.PING_SOCKET_DESTROY_TIMEOUT_MSECS,
  } = {}) {
    this.#pingDomain = pingDomain;
    this.#pingMinDelayMsecs = pingMinDelayMsecs;
    this.#pingSocketDestroyTimeoutMscs = pingSocketDestroyTimeoutMscs;
  }
  
  async #checkPing() {
    return await new Promise((r, j) => {
      let beforeRequest = Date.now(), afterRequest;
      
      let req = http.get(this.#pingDomain, res => {
        afterRequest = Date.now();
        
        r({
          ping: afterRequest - beforeRequest,
          requestEnd: afterRequest,
        });
        
        res.on('data', () => {});
        res.on('end', () => {});
        res.on('error', () => {});
        
        setTimeout(() => {
          if (!req.socket.destroyed) {
            req.socket.destroySoon();
          }
        }, this.#pingSocketDestroyTimeoutMscs).unref();
      });
      
      req.on('error', err => {
        j(err);
      });
      
      req.end();
    });
  }
  
  async checkPing() {
    if (this.#requestBatching) {
      // if in batching mode add request to the batch
      
      return new Promise((r, j) => {
        this.#batchedRequests.push({ r, j });
      });
    } else {
      if (this.#lastCheckEnd == null) {
        // first ping request always is allowed
        
        let {
          ping,
          requestEnd,
        } = this.#checkPing();
        
        this.#lastCheckEnd = requestEnd;
        
        return ping;
      } else {
        const now = Date.now();
        const timeSinceLastPing = now - this.#lastCheckEnd;
        
        if (timeSinceLastPing > this.#pingMinDelayMsecs) {
          // request after long enough delay is allowed
          
          let {
            ping,
            requestEnd,
          } = this.#checkPing();
          
          this.#lastCheckEnd = requestEnd;
          
          return ping;
        } else {
          // request without enough delay must be batched
          
          this.#requestBatching = true;
          
          const resultPromise = new Promise((r, j) => {
            this.#batchedRequests.push({ r, j });
          });
          
          setTimeout(
            () => {
              let {
                ping,
                requestEnd,
              } = this.#checkPing();
              
              this.#lastCheckEnd = requestEnd;
              
              for (const { r, j } of this.#batchedRequests) {
                r(ping);
              }
              
              this.#requestBatching = false;
              this.#batchedRequests.length = 0;
            },
            Math.max(Math.min(this.#pingMinDelayMsecs - timeSinceLastPing, 0), this.#pingMinDelayMsecs),
          ).unref();
          
          return resultPromise;
        }
      }
    }
  }
};
