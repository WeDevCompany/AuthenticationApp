export class InvalidStrategyError extends Error {
  constructor(message: string) {
    super(`InvalidUserError: ${message}`);
    Object.setPrototypeOf(this, InvalidStrategyError.prototype);
  }
}
