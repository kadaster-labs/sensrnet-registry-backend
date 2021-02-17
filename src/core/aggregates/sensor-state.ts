export interface SensorState {
  id: string;

  active: boolean;
  legalEntityIds: string[];
}

export class SensorStateImpl implements SensorState {
  constructor(
      public readonly id: string,
      public active: boolean = true,
      public legalEntityIds: string[] = [],
  ) {}
}
