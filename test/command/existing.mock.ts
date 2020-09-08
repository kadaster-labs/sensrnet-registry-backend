export class ExistingEventStoreMock {
    connect = (): void => void 0;
    exists = (): boolean => true;
    getEvents = (): [] => [];
}
