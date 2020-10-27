const TYPES = {
  UserRepository: Symbol.for('UserInMemoryRepository'),
  OAuthAutenticationService: Symbol.for('PassportOAuthAutenticationService'),
  Logger: Symbol.for('ConsoleLogger'),
};

export default TYPES;
