class InvalidProviderError extends Error {
  constructor(message: string) {
    super(`InvalidProviderError: ${message}`);
    Object.setPrototypeOf(this, InvalidProviderError.prototype);
  }
}

export { InvalidProviderError };
