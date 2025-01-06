const Gear = require('../models/gear.js');
const express = require('express');
const router = express.Router();

router.put('/:gearId', async (req, res) => {
    const gearId = req.params.gearId
    const gearData = req.body

    const updatedGear = await Gear.findByIdAndUpdate(gearId, gearData, {
        new: true,
    })
    res.json(updatedGear);
})

router.delete('/:gearId', async (req, res) => {
    try {
        const foundGear = await Gear.findByIdAndDelete(req.params.gearId);
        if (!foundGear) {
            res.status(404);
            throw new Error ('Gear not found.');
        }
        res.status(200).json(foundGear);
    } catch (error) {
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;