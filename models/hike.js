const mongoose = require('mongoose');

const hikeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    hiker: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

hikeSchema.virtual('gears', {
    ref: "Gear",
    localField: '_id',
    foreignField: 'hike',
    justOne: false,
});

const Hike = mongoose.model('Hike', hikeSchema);

module.exports = Hike;