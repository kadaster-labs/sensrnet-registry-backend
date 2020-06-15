import { ICommand } from '@nestjs/cqrs';

export class EmitUpdateCommand implements ICommand {
    constructor(public readonly heroId: string, public readonly itemId: string) {
        console.log('new emitupdatecommand');
    }
}
