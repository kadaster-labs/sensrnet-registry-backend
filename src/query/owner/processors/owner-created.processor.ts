import { Injectable } from "@nestjs/common";
import { Owner } from "../models/owner.model";


@Injectable()
export class OwnerCreatedProcessor {

    async process(event): Promise<void> {
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
}
