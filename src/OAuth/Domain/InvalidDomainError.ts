class InvalidDomainError extends Error {
  constructor(message: string) {
    super(`InvalidDomainError: ${message}`);
    Object.setPrototypeOf(this, InvalidDomainError.prototype);
  }
}

export { InvalidDomainError };
