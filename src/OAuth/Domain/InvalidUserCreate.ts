class InvalidUserCreate extends Error {
  constructor(message: string) {
    super(`InvalidUserCreate: ${message}`);
    Object.setPrototypeOf(this, InvalidUserCreate.prototype);
  }
}

export { InvalidUserCreate };
