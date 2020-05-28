import { Owner } from "../models/owner.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class OwnerDeletedProcessor {

    async process(event): Promise<void> {
        Owner.deleteOne({_id: event.data["ownerId"]}, (err) => {
            if (err) Logger.error('Error while deleting projection.');
        });
    }
}
