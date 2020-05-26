import { model, Schema } from 'mongoose';


export const OwnerSchema = new Schema({
    _id: { type: String, required: true },
    nodeId: { type: String, required: true },
    ssoId: { type: String, required: false },
    email: { type: String, required: true },
    publicName: { type: String, required: false },
    name: { type: String, required: true },
    companyName: { type: String, required: false },
    website: { type: String, required: false }
});

export const Owner = model('Owner', OwnerSchema);
