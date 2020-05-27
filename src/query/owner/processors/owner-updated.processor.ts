import { Owner } from "../models/owner.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class OwnerUpdatedProcessor {

    async process(event): Promise<void> {
        const ownerData = {};
        if (event.data["nodeId"]) ownerData["nodeId"] = event.data["nodeId"];
        if (event.data["ssoId"]) ownerData["ssoId"] = event.data["ssoId"];
        if (event.data["email"]) ownerData["email"] = event.data["email"];
        if (event.data["publicName"]) ownerData["publicName"] = event.data["publicName"];
        if (event.data["name"]) ownerData["name"] = event.data["name"];
        if (event.data["companyName"]) ownerData["companyName"] = event.data["companyName"];
        if (event.data["website"]) ownerData["website"] = event.data["website"];

        Owner.updateOne({_id: event.data["ownerId"]}, ownerData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
