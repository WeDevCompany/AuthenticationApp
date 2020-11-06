const TYPES = {
  UserRepository: Symbol.for('TypeORMUserRepository'),
  OAuthAutenticationService: Symbol.for('PassportOAuthAutenticationService'),
  Logger: Symbol.for('ConsoleLogger'),
  Connection: Symbol.for('ConnectionOptions'),
};

export default TYPES;
