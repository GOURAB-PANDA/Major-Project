class ExpressEror extends Error {
  constructor(ststusCode, message) {
    super();
    this.ststusCode = ststusCode;
    this.message = message;
  }
}

module.exports =ExpressEror;