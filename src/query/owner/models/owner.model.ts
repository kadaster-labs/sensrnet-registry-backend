import { model, Schema, connect } from 'mongoose';

connect('mongodb://localhost:27017/owners');

export const OwnerSchema = new Schema({
    _id: { type: String, required: true },
    nodeId: { type: String, required: true },
    ssoId: { type: String, required: true },
    email: { type: String, required: true },
    publicName: { type: String, required: false },
    name: { type: String, required: true },
    companyName: { type: String, required: false },
    website: { type: String, required: true }
});

export const Owner = model('Owner', OwnerSchema);
