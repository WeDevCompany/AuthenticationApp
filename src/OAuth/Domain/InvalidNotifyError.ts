export class InvalidNotifyError extends Error {
  constructor(message: string) {
    super(`InvalidNotifyError: ${message}`);
    Object.setPrototypeOf(this, InvalidNotifyError.prototype);
  }
}
