const TYPES = {
  UserRepository: Symbol.for('TypeORMUserRepository'),
  OAuthAutenticationService: Symbol.for('PassportOAuthAutenticationService'),
  Logger: Symbol.for('ConsoleLogger'),
};

export default TYPES;
