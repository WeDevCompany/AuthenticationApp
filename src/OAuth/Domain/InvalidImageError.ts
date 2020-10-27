class InvalidImageError extends Error {
  constructor(message: string) {
    super(`InvalidImageError: ${message}`);
    Object.setPrototypeOf(this, InvalidImageError.prototype);
  }
}

export { InvalidImageError };
