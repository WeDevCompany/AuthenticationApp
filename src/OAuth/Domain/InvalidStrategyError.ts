export class InvalidStrategyError extends Error {
  constructor(message: string) {
    super(`InvalidStrategyError: ${message}`);
    Object.setPrototypeOf(this, InvalidStrategyError.prototype);
  }
}
