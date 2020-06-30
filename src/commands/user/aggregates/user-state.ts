export interface UserState {
  email: string;
}

export class UserStateImpl implements UserState {
  constructor(
      public readonly email: string,
  ) {
  }
}
