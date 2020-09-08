export class NonExistingEventStoreMock {
    connect = (): void => void 0;
    exists = (): boolean => false;
}
