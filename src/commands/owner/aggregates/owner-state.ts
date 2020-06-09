export interface OwnerState {
  id: string;
}

export class OwnerStateImpl implements OwnerState {
  constructor(
      public readonly id: string,
  ) {
  }
}
