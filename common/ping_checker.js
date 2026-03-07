let commonConstants = require('./constants');

module.exports = class PingChecker {
  #pingDomain;
  #pingMinDelaySecs;
  #pingSocketDestroyTimeoutSecs;
  
  constructor({
    pingDomain = commonConstants.PING_TEST_DOMAIN,
    pingMinDelaySecs = commonConstants.PING_MIN_DELAY_SECS,
    pingSocketDestroyTimeoutSecs = commonConstants.PING_SOCKET_DESTROY_TIMEOUT_SECS,
  } = {}) {
    this.#pingDomain = pingDomain;
    this.#pingMinDelaySecs = pingMinDelaySecs;
    this.#pingSocketDestroyTimeoutSecs = pingSocketDestroyTimeoutSecs;
  }
  
  async #checkPing() {
    return await new Promise((r, j) => {
      let beforeRequest = Date.now(), afterRequest;
      
      let req = http.get(this.#pingDomain, res => {
        afterRequest = Date.now();
        
        r(afterRequest - beforeRequest);
        
        res.on('data', () => {});
        res.on('end', () => {});
        res.on('error', () => {});
        
        setTimeout(() => {
          if (!req.socket.destroyed) {
            req.socket.destroySoon();
          }
        }, this.#pingSocketDestroyTimeoutSecs).unref();
      });
      
      req.on('error', err => {
        j(err);
      });
      
      req.end();
    });
  }
  
  async checkPing() {
    return this.#checkPing();
  }
};
