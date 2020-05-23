import { AggregateRoot } from "@nestjs/cqrs";
import { Created } from "../events/created.event";
import { Deleted } from "../events/deleted.event";
import { Updated } from "../events/updated.event";
import { isValidEvent } from "../../event-store/event-utils";


export class OwnerAggregate extends AggregateRoot {

  constructor(private readonly aggregateId: string) {
    super();
  }

  create(nodeId: string, ssoId: string, email: string, publicName: string, name: string,
    companyName: string, website: string) {
    this.apply(new Created(this.aggregateId, nodeId, ssoId, email, publicName, name, companyName, website));
  }

  update(ssoId: string, email: string, publicName: string, name: string,
    companyName: string, website: string) {
    this.apply(new Updated(this.aggregateId, ssoId, email, publicName, name, companyName, website));
  }

  delete() {
    this.apply(new Deleted(this.aggregateId));
  }

  private onCreated(event: Created) {
    // Called on Created -> Update Database.
  }

  private onUpdated(event: Updated) {
    // Called on Updated -> Update Database.
  }

  private onDeleted(event: Deleted) {
    // Called on Deleted -> Update Database.
  }

  protected getEventName(event): string {
    if (isValidEvent(event)) {
      return event.eventType;
    } else {
      return super.getEventName(event);
    }
  }
}
