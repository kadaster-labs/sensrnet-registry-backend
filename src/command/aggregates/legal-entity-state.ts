export interface LegalEntityState {
    id: string;
}

export class LegalEntityStateImpl implements LegalEntityState {
    constructor(public readonly id: string) {}
}
