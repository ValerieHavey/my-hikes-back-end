const mongoose = require('mongoose');

const gearSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Clothing', 'Shoes', 'Backpack', 'Trekking Poles', 'GPS' ],
    },
    brand: {
        type: String,
    },
    notes: {
        type: String,
    },
    hike: {
        type: mongoose.Types.ObjectId,
        ref: "Hike"
    }
});

const Gear = mongoose.model('Gear', gearSchema);

module.exports = Gear;