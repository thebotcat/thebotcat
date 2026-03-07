let commonConstants = require('./constants');

module.exports = class Pinger {
  #pingDomain;
  #pingMinDelaySecs;
  
  constructor({
    pingDomain = commonConstants.PING_TEST_DOMAIN,
    pingMinDelaySecs = commonConstants.PING_MIN_DELAY_SECS,
  } = {}) {
    this.#pingDomain = pingDomain;
    this.#pingMinDelaySecs = pingMinDelaySecs;
  }
  
  async checkPing() {
    // TODO
    return 0;
  }
};
