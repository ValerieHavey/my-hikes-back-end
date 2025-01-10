const Hike = require('../models/hike.js');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token.js');
const Gear = require('../models/gear.js');


// CRUD Action: CREATE
// Method: POST
// Path: /hikes
// Response: JSON
// Success Status Code: 201 Created
// Success Response Body: A new Hike object
// Error Status Code: 500 Internal Server Error
// Error Response Body: A JSON object with an error key and a message describing the error

router.post('/', verifyToken, async (req, res) => {
    try {
        const hikerId = req.user._id
        const createHike = await Hike.create({
            ...req.body,
            hiker:hikerId
        });
        res.status(201).json(createHike);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRUD Action: READ
// Method: GET
// Path: /hikes
// Response: JSON
// Success Status Code: 200 Ok
// Success Response Body: An array of all the hikes in the database named hikes. The array will be empty if there are no hikes in the database.
// Error Status Code: 500 Internal Server Error
// Error Response Body: A JSON object with an error key and a message describing the error.

router.get('/', verifyToken, async (req, res) => {
    try {
        const hikerId = req.user._id
        const foundHikes = await Hike.find({
            hiker:hikerId
        }).populate('gears').lean();
        res.status(200).json(foundHikes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// CRUD Action: READ
// Method: GET
// Path: /hikes/:hikeId
// Response: JSON
// Success Status Code: 200 Ok
// Success Response Body: A JSON object with the hike that matches the hikeId parameter.
// Error Status Code: 404 Not Found 	  	500 Internal Server Error
// Error Response Body: A JSON object with an error key and a message describing the error.

router.get('/:hikeId', async (req, res) => {
    try {
        const foundHike = await Hike.findById(req.params.hikeId);
        if (!foundHike) {
            res.status(404);
            throw new Error('Hike not found.');
        }
        res.status(200).json(foundHike);
    } catch (error) {
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({error: error.message });
        }
    }
});



// CRUD Action: UPDATE
// Method: PUT
// Path: /hikes/:hikeId
// Response: JSON
// Success Status Code: 200 Ok
// Success Response Body: A JSON object with the updated hike.
// Error Status Code: 404 Not Found 	  	500 Internal Server Error
// Error Response Body: A JSON object with an error key and a message describing the error.

router.put('/:hikeId', verifyToken, async (req, res) => {
    try {
        const foundHike = await Hike.findById(req.params.hikeId);
        if (!foundHike) {
            res.status(404);
            throw new Error('Hike not found.');
        } 
        console.log(foundHike.hiker, req.user._id);
        if (foundHike.hiker !== req.user._id){
            res.status(403)
            throw new Error('Hike belongs to another user.');
        }
        const updateHike = await Hike.findByIdAndUpdate(req.params.hikeId, req.body, {
            new: true,
        });
        if (!updateHike) {
            res.status(404);
            throw new Error ("Hike not found.");
        }
        res.status(200).json(updateHike);
    } catch (error) {
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


// CRUD Action: DELETE
// Method: DELETE
// Path: /hikes/:hikeId
// Response: JSON
// Success Status Code: 200 Ok
// Success Response Body: A JSON object with the deleted hike.
// Error Status Code: 404 Note Found 	  	500 Internal Server Error
// Error Response Body: A JSON object with an error key and a message describing the error.

router.delete('/:hikeId', verifyToken, async (req, res) => {
    try {
        const foundHike = await Hike.findById(req.params.hikeId);
        if (!foundHike) {
            res.status(404);
            throw new Error('Hike not found.');
        } 
        if (foundHike.hiker !== req.user._id){
            res.status(403)
            throw new Error('Hike belongs to another user.');
        }
        await Hike.findByIdAndDelete(req.params.hikeId)
        await Gear.deleteMany({hike:req.params.hikeId})
        res.status(200).json(foundHike);
    } catch (error) {
        if (res.statusCode === 403 || res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


router.post('/:hikeId/gears', async (req, res) => {
    try {
        const hikeId = req.params.hikeId
        const addGear = await Gear.create({
            ...req.body,
            hike:hikeId
        });
        res.status(201).json(addGear);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
