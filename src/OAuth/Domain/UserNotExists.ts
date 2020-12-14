class UserNotExists extends Error {
  constructor(message: string) {
    super(`UserNotExists: ${message}`);
    Object.setPrototypeOf(this, UserNotExists.prototype);
  }
}

export { UserNotExists };
