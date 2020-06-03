export interface OwnerState {
  id: string;
  nodeIds: string[];
  ssoIds: string[];
  emails: string[];
  publicNames: string[];
  names: string[];
  companyNames: string[];
  websites: string[];

  nodeId: string;
  ssoId: string;
  email: string;
  publicName: string;
  name: string;
  companyName: string;
  website: string;
}

export class OwnerStateImpl implements OwnerState {
  constructor(
      public readonly id: string,
      public nodeIds: string[] = [],
      public ssoIds: string[] = [],
      public emails: string[] = [],
      public publicNames: string[] = [],
      public names: string[] = [],
      public companyNames: string[] = [],
      public websites: string[] = [],
  ) {
  }

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
