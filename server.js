const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const myHikesJWTRouter = require('./controllers/my-Hikes-JWT.js');
const usersRouter = require('./controllers/users.js')
const hikeRouter = require('./controllers/hikes.js');
const profilesRouter = require('./controllers/profiles.js');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes go here
app.use('/hikes', hikeRouter);
app.use('/my-hikes-JWT', myHikesJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);


app.listen(3000, () => {
  console.log('The express app is ready!');
});
