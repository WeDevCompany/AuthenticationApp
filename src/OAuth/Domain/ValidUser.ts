interface ValidUser {
  readonly id: string;
  readonly displayName: string;
  readonly username: string;
  readonly image: string;
  readonly email?: string;
}

export { ValidUser };
