import { Schema } from 'mongoose';

export const CheckpointSchema = new Schema({
    _id: { type: String, required: true },
    offset: { type: Number, required: false },
}, {
    autoCreate: true,
});
