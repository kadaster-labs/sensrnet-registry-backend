import { Owner } from "../models/owner.model";
import { plainToClass } from "class-transformer";
import { Injectable, Logger } from "@nestjs/common";
import { OwnerRegistered, OwnerUpdated, OwnerDeleted, eventType }  from "src/events/owner/events";


@Injectable()
export class OwnerProcessor {

    async process(event): Promise<void> {

        event = plainToClass(eventType.getType(event.eventType), event);

        if (event instanceof OwnerRegistered) {
            this.processCreated(event);
        } else if (event instanceof OwnerUpdated) {
            this.processUpdated(event);
        } else if (event instanceof OwnerDeleted) {
            this.processDeleted(event);
        }
        else {
            Logger.warn(`Caught unsupported event: ${event}`)
        }
    }

    async processCreated(event: OwnerRegistered): Promise<void> {
        const ownerInstance = new Owner({
            _id: event.data["ownerId"],
            nodeId: event.data["nodeId"],
            ssoId: event.data["ssoId"],
            email: event.data["email"],
            publicName: event.data["publicName"],
            name: event.data["name"],
            companyName: event.data["companyName"],
            website: event.data["website"]
        });
        ownerInstance.save();
    }

    async processUpdated(event: OwnerUpdated): Promise<void> {
        const ownerData = {};
        if (event.data["nodeId"]) ownerData["nodeId"] = event.data["nodeId"];
        if (event.data["ssoId"]) ownerData["ssoId"] = event.data["ssoId"];
        if (event.data["email"]) ownerData["email"] = event.data["email"];
        if (event.data["publicName"]) ownerData["publicName"] = event.data["publicName"];
        if (event.data["name"]) ownerData["name"] = event.data["name"];
        if (event.data["companyName"]) ownerData["companyName"] = event.data["companyName"];
        if (event.data["website"]) ownerData["website"] = event.data["website"];

        Owner.updateOne({ _id: event.data["ownerId"] }, ownerData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }

    async processDeleted(event: OwnerDeleted): Promise<void> {
        Owner.deleteOne({ _id: event.data["ownerId"] }, (err) => {
            if (err) Logger.error('Error while deleting projection.');
        });
    }

}
