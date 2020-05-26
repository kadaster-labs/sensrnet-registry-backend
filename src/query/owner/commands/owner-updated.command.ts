export class OwnerUpdatedCommand {
  constructor(
    public readonly id: string,
    public readonly data: object
  ) {}
}