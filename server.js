const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const usersRouter = require('./controllers/users.js')
const hikeRouter = require('./controllers/hikes.js');
const profilesRouter = require('./controllers/profiles.js');
const gearRouter = require('./controllers/gears.js');

const app = express();


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URI }))
app.use(express.static(path.join(__dirname, "my-hikes-front-end/dist")))

// Routes go here
app.use('/hikes', hikeRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/gears', gearRouter);

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}`);
});
