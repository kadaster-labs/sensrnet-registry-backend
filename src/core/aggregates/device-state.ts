export interface DeviceState {
  id: string;
  location: number[];
}

export class DeviceStateImpl implements DeviceState {
  constructor(
      public readonly id: string,
      public readonly location: number[],
  ) {}
}
