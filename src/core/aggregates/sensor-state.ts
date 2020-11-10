export interface SensorState {
  id: string;

  active: boolean;
  organizationIds: string[];
}

export class SensorStateImpl implements SensorState {
  constructor(
      public readonly id: string,
      public active: boolean = true,
      public organizationIds: string[] = [],
  ) {}
}
