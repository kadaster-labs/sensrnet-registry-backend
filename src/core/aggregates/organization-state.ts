export interface OrganizationState {
  id: string;
}

export class OrganizationStateImpl implements OrganizationState {
  constructor(
      public readonly id: string,
  ) {}
}
