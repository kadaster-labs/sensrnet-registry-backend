import { ICommand } from '@nestjs/cqrs';
import { Category } from '../../controller/model/category.body';
import { RegisterLocationBody } from '../../controller/model/location/register-location.body';

export class RegisterDeviceCommand implements ICommand {
    constructor(
        public readonly deviceId: string,
        public readonly legalEntityId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly category: Category,
        public readonly connectivity: string,
        public readonly location: RegisterLocationBody,
    ) {}
}
