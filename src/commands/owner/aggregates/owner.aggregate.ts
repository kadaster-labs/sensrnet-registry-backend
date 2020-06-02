import { AggregateRoot } from "@nestjs/cqrs";
import { isValidEvent } from "../../../event-store/event-utils";
import { OwnerRegistered } from "../../../events/owner/events/registered.event";
import { OwnerDeleted } from "../../../events/owner/events/deleted.event";
import { OwnerUpdated } from "../../../events/owner/events/updated.event";


export class OwnerAggregate extends AggregateRoot {
  state!: OwnerState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  register(nodeId: string, ssoId: string, email: string, publicName: string, name: string,
    companyName: string, website: string) {
    this.apply(new OwnerRegistered(this.aggregateId, nodeId, ssoId, email, publicName, 
      name, companyName, website));
  }

  update(ssoId: string, email: string, publicName: string, name: string,
    companyName: string, website: string) {
    this.apply(new OwnerUpdated(this.aggregateId, ssoId, email, publicName, name, 
      companyName, website));
  }

  delete() {
    this.apply(new OwnerDeleted(this.aggregateId));
  }

  private onRegistered(event: OwnerRegistered) {
    this.state = new OwnerStateImpl(this.aggregateId);

    this.state.nodeIds.push(event.data["nodeId"]);
    this.state.ssoIds.push(event.data["ssoId"]);
    this.state.emails.push(event.data["email"]);

    if (event.data["publicName"]) {
      this.state.publicNames.push(event.data["publicName"]);
    }
    
    this.state.names.push(event.data["name"]);

    if (event.data["companyName"]) {
      this.state.companyNames.push(event.data["companyName"]);
    }

    if (event.data["website"]) {
      this.state.websites.push(event.data["website"]);
    }
  }

  private onUpdated(event: OwnerUpdated) {
    if (event.data["ssoId"]) {
      this.state.ssoIds.push(event.data["ssoId"]);
    }

    if (event.data["email"]) {
      this.state.emails.push(event.data["email"]);
    }

    if (event.data["publicName"]) {
      this.state.publicNames.push(event.data["publicName"]);
    }
    
    if (event.data["name"]) {
      this.state.names.push(event.data["name"]);
    }

    if (event.data["companyName"]) {
      this.state.companyNames.push(event.data["companyName"]);
    }

    if (event.data["website"]) {
      this.state.websites.push(event.data["website"]);
    }
  }

  private onDeleted(event: OwnerDeleted) {
    // Called on Deleted.
  }

  protected getEventName(event): string {
    if (isValidEvent(event)) {
      return event.eventType;
    } else {
      return super.getEventName(event);
    }
  }
}

interface OwnerState {
  id: string;
  nodeIds: Array<string>;
  ssoIds: Array<string>;
  emails: Array<string>;
  publicNames: Array<string>;
  names: Array<string>;
  companyNames: Array<string>;
  websites: Array<string>;

  nodeId: string;
  ssoId: string;
  email: string;
  publicName: string;
  name: string;
  companyName: string;
  website: string;
}

class OwnerStateImpl implements OwnerState {
  constructor(
    public readonly id: string,
    public nodeIds: string[] = [],
    public ssoIds: string[] = [],
    public emails: string[] = [],
    public publicNames: string[] = [],
    public names: string[] = [],
    public companyNames: string[] = [],
    public websites: string[] = []
  ) {}

  get nodeId(): string {
    return this.nodeIds.length ? this.nodeIds[this.nodeIds.length - 1] : undefined;
  }

  get ssoId(): string {
    return this.ssoIds.length ? this.ssoIds[this.ssoIds.length - 1] : undefined;
  }

  get email(): string {
    return this.emails.length ? this.emails[this.emails.length - 1] : undefined;
  }

  get publicName(): string {
    return this.publicNames.length ? this.publicNames[this.publicNames.length - 1] : undefined;
  }

  get name(): string {
    return this.names.length ? this.names[this.names.length - 1] : undefined;
  }

  get companyName(): string {
    return this.companyNames.length ? this.companyNames[this.companyNames.length - 1] : undefined;
  }

  get website(): string {
    return this.websites.length ? this.websites[this.websites.length - 1] : undefined;
  }
}
