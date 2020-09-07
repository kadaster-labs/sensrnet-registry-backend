export interface SensorState {
  id: string;

  active: boolean;
  ownerIds: string[];
}

export class SensorStateImpl implements SensorState {
  constructor(
      public readonly id: string,
      public active: boolean = true,
      public ownerIds: string[] = [],
  ) {
  }
}
