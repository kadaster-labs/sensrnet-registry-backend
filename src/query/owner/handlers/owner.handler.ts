import { Logger } from '@nestjs/common';
import { Owner } from "../models/owner.model"
import { EventType } from "../../../events/owner/events/event-type";


export class OwnerEventHandler {

    onEventAppeared(_, event) {        
        const modulePrefix = 'owner';
        const eventType = event.eventType;
        const modulePrefixLength = modulePrefix.length;
        const id = event.streamId.substring(modulePrefixLength + 1, event.streamId.length);

        if (eventType == EventType.Created) {
            const ownerInstance = new Owner({
                _id: id,
                nodeId: event.data["nodeId"],
                ssoId: event.data["ssoId"],
                email: event.data["email"],
                publicName: event.data["publicName"],
                name: event.data["name"],
                companyName: event.data["companyName"],
                website: event.data["website"]
            });
            ownerInstance.save();

        } else if (eventType == EventType.Updated) {
            const ownerData = {};
            if (event.data["nodeId"]) ownerData["nodeId"] = event.data["nodeId"];
            if (event.data["ssoId"]) ownerData["ssoId"] = event.data["ssoId"];
            if (event.data["email"]) ownerData["email"] = event.data["email"];
            if (event.data["publicName"]) ownerData["publicName"] = event.data["publicName"];
            if (event.data["name"]) ownerData["name"] = event.data["name"];
            if (event.data["companyName"]) ownerData["companyName"] = event.data["companyName"];
            if (event.data["website"]) ownerData["website"] = event.data["website"];

            Owner.updateOne({_id: id}, ownerData, (err) => {
                if (err) Logger.error('Error while updating projection.');
            });
        } else if (eventType == EventType.Deleted) {
            Owner.deleteOne({_id: id}, (err) => {
                if (err) Logger.error('Error while deleting projection.');
            });
        }
    }

    onDropped() {}
}
