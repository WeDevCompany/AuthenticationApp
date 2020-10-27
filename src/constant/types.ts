const TYPES = {
  UserRepository: Symbol.for('UserInMemoryRepository'),
  OAuthAutenticationService: Symbol.for('PassportOAuthAutenticationService'),
  OAuthAutenticationMiddleware: Symbol.for('PassportOauthMiddleware'),
  Logger: Symbol.for('ConsoleLogger'),
};

export default TYPES;
