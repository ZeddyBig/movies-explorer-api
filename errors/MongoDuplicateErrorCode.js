class MongoDuplicateErrorCode extends Error {
  constructor(message) {
    super(message);
    this.name = 'MongoDuplicateErrorCode';
    this.statusCode = 409;
  }
}

module.exports = MongoDuplicateErrorCode;
