export interface OAuthAutenticationService {
  getAuthenticator(strategy: string): object;
}
