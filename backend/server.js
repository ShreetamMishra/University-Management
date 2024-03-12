// import express from 'express';
// import cors from 'cors';
// import morgan from 'morgan';
// import connect from './database/conn.js';
// import router from './router/route.js';

// const app = express();

// /** middlewares */
// app.use(express.json());
// app.use(cors());
// app.use(morgan('tiny'));
// app.disable('x-powered-by'); // less hackers know about our stack


// const port = 8080;

// /** HTTP GET Request */
// app.get('/', (req, res) => {
//     res.status(201).json("Home GET Request");
// });


// /** api routes */
// app.use('/api', router)

// /** start server only when we have valid connection */
// connect().then(() => {
//     try {
//         app.listen(port, () => {
//             console.log(`Server connected to http://localhost:${port}`);
//         })
//     } catch (error) {
//         console.log('Cannot connect to the server')
//     }
// }).catch(error => {
//     console.log("Invalid database connection...!");
// })

// server.js

// server.js

// server.js
// server.jsrequire('dotenv').config();

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const { detectFakeVideo } = require('./fakeVideoDetection.js'); // Using require for CommonJS modules
const mongoose = require('mongoose');
const sanitizeFilename = require('sanitize-filename');
const ENV =require('./config.js');
// Set up Express app
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

// Connect to MongoDB Atlas
console.log(ENV.ATLAS_URI);

mongoose.connect("mongodb+srv://shreetammishra:sritam108@cluster0.t2aqcgn.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));


// Define video schema and model
const videoSchema = new mongoose.Schema({
    filename: String,
    uploadTimestamp: { type: Date, default: Date.now },
    detectionResults: Object
});

const Video = mongoose.model('Video', videoSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const sanitizedFilename = sanitizeFilename(file.originalname);
        cb(null, sanitizedFilename);
    }
});

const upload = multer({ storage: storage });

// Route for uploading videos
app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const file = req.file;
        const uploadedVideo = new Video({ filename: file.originalname });
        await uploadedVideo.save();
        res.status(200).json({ message: 'Video uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading video' });
    }
});

// Route for processing videos for fake detection
app.post('/detectFake', async (req, res) => {
    try {
        const videoId = req.body.videoId;
        const video = await Video.findById(videoId);
        const detectionResults = await detectFakeVideo(video.filename); // Assume detectFakeVideo is a function that returns detection results
        video.detectionResults = detectionResults;
        await video.save();
        res.status(200).json({ message: 'Fake detection completed', results: detectionResults });
    } catch (error) {
        res.status(500).json({ error: 'Error detecting fake video' });
    }
});

// Route for retrieving detection results
app.get('/results/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId);
        res.status(200).json({ results: video.detectionResults });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving results' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});