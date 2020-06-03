export interface SensorState {
  id: string;
  actives: boolean[];

  active: boolean;
}

export class SensorStateImpl implements SensorState {
  constructor(
      public readonly id: string,
      public actives: boolean[] = [],
  ) {
  }

  get active(): boolean {
    return this.actives.length ? this.actives[this.actives.length - 1] : undefined;
  }
}
