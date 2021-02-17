export interface DataStreamState {
  id: string;

  legalEntityIds: string[];
}

export class DataStreamStateImpl implements DataStreamState {
  constructor(
      public readonly id: string,
      public legalEntityIds: string[] = [],
  ) {}
}
