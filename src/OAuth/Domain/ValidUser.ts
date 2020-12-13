interface ValidUser {
  readonly idFromProvider: string;
  readonly displayName: string;
  readonly username: string;
  readonly image: string;
  readonly email: string;
  readonly provider: string;
}

export { ValidUser };
