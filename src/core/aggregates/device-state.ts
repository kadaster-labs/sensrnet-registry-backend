export interface DeviceState {
  id: string;
  legalEntityId: string;

  location?: number[];
}

export class DeviceStateImpl implements DeviceState {
  public location;

  constructor(
      public readonly id: string,
      public readonly legalEntityId: string,
  ) {}
}
