export class InvalidOAuthMethod extends Error {
  constructor(message: string) {
    super(`InvalidOAuthMethod: ${message}`);
    Object.setPrototypeOf(this, InvalidOAuthMethod.prototype);
  }
}
