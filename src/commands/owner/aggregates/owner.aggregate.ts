import { AggregateRoot } from "@nestjs/cqrs";
import { OwnerCreated } from "../../../events/owner/events/created.event";
import { OwnerDeleted } from "../../../events/owner/events/deleted.event";
import { OwnerUpdated } from "../../../events/owner/events/updated.event";
import { isValidEvent } from "../../../event-store/event-utils";


export class OwnerAggregate extends AggregateRoot {
  state!: OwnerState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  create(nodeId: string, ssoId: string, email: string, publicName: string, name: string,
    companyName: string, website: string) {
    this.apply(new OwnerCreated(this.aggregateId, new Date().toISOString(), nodeId, ssoId, email, 
      publicName, name, companyName, website));
  }

  update(ssoId: string, email: string, publicName: string, name: string,
    companyName: string, website: string) {
    this.apply(new OwnerUpdated(this.aggregateId,  new Date().toISOString(), ssoId, email, 
      publicName, name, companyName, website));
  }

  delete() {
    this.apply(new OwnerDeleted(this.aggregateId, new Date().toISOString()));
  }

  private onCreated(event: OwnerCreated) {
    this.state = new OwnerStateImpl(this.aggregateId);

    this.state.nodeIds.push([event.data["date"], event.data["nodeId"]]);
    this.state.ssoIds.push([event.data["date"], event.data["ssoId"]]);
    this.state.emails.push([event.data["date"], event.data["email"]]);

    if (event.data["publicName"]) {
      this.state.publicNames.push([event.data["date"], event.data["publicName"]]);
    }
    
    this.state.names.push([event.data["date"], event.data["name"]]);

    if (event.data["companyName"]) {
      this.state.companyNames.push([event.data["date"], event.data["companyName"]]);
    }

    if (event.data["website"]) {
      this.state.websites.push([event.data["date"], event.data["website"]]);
    }
  }

  private onUpdated(event: OwnerUpdated) {
    if (event.data["ssoId"]) {
      this.state.ssoIds.push([event.data["date"], event.data["ssoId"]]);
    }

    if (event.data["email"]) {
      this.state.emails.push([event.data["date"], event.data["email"]]);
    }

    if (event.data["publicName"]) {
      this.state.publicNames.push([event.data["date"], event.data["publicName"]]);
    }
    
    if (event.data["name"]) {
      this.state.names.push([event.data["date"], event.data["name"]]);
    }

    if (event.data["companyName"]) {
      this.state.companyNames.push([event.data["date"], event.data["companyName"]]);
    }

    if (event.data["website"]) {
      this.state.websites.push([event.data["date"], event.data["website"]]);
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
  nodeIds: Array<[string, string]>;
  ssoIds: Array<[string, string]>;
  emails: Array<[string, string]>;
  publicNames: Array<[string, string]>;
  names: Array<[string, string]>;
  companyNames: Array<[string, string]>;
  websites: Array<[string, string]>;

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
    public nodeIds: [string, string][] = [],
    public ssoIds: [string, string][] = [],
    public emails: [string, string][] = [],
    public publicNames: [string, string][] = [],
    public names: [string, string][] = [],
    public companyNames: [string, string][] = [],
    public websites: [string, string][] = []
  ) {}

  get nodeId(): string {
    return this.nodeIds.length ? this.nodeIds.map(value => value[1])[this.nodeIds.length - 1] : undefined;
  }

  get ssoId(): string {
    return this.ssoIds.length ? this.ssoIds.map(value => value[1])[this.ssoIds.length - 1] : undefined;
  }

  get email(): string {
    return this.emails.length ? this.emails.map(value => value[1])[this.emails.length - 1] : undefined;
  }

  get publicName(): string {
    return this.publicNames.length ? this.publicNames.map(value => value[1])[this.publicNames.length - 1] : undefined;
  }

  get name(): string {
    return this.names.length ? this.names.map(value => value[1])[this.names.length - 1] : undefined;
  }

  get companyName(): string {
    return this.companyNames.length ? this.companyNames.map(value => value[1])[this.companyNames.length - 1] : undefined;
  }

  get website(): string {
    return this.websites.length ? this.websites.map(value => value[1])[this.websites.length - 1] : undefined;
  }
}
