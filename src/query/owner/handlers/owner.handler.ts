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
            console.log('updatedHandler');
            // TODO
        } else if (eventType == EventType.Deleted) {
            console.log('deletedHandler');
            // TODO
        }
    }

    onDropped() {}
}
