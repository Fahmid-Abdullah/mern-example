import mongoose from 'mongoose';

const somethingSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        }
    }
);

export const Something = mongoose.model('Something', somethingSchema )