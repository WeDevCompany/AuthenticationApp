class InvalidDateTime extends Error {
  constructor(message: string | undefined) {
    super(`InvalidDateTime: Date provide is invalid - data: ${message}`);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidDateTime.prototype);
  }
}

export { InvalidDateTime };
