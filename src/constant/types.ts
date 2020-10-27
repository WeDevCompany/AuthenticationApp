const TYPES = {
  UserRepository: Symbol.for('UserInMemoryRepository'),
  OAuthAutenticationService: Symbol.for('PassportOAuthAutenticationService'),
  OAuthAutenticationMiddleware: Symbol.for('PassportOauthMiddleware'),
};

export default TYPES;
