export class OwnerCreatedCommand {
  constructor(
    public readonly id: string,
    public readonly data: object
  ) {}
}