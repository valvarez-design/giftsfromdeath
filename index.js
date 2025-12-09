// Import required packages
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware - serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes for clean URLs
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/digitalheaven', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'heaven.html'));
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/death-reflections';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create a Schema for responses
const responseSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a Model from the schema
const Response = mongoose.model('Response', responseSchema);

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // When a client requests all responses
    socket.on('getResponses', async () => {
        try {
            // Get all responses from MongoDB, sorted by newest first
            const responses = await Response.find().sort({ timestamp: -1 });
            socket.emit('allResponses', responses);
        } catch (error) {
            console.error('Error fetching responses:', error);
            socket.emit('allResponses', []);
        }
    });

    // When a client adds a new response
    socket.on('addResponse', async (data) => {
        try {
            // Create new response in MongoDB
            const newResponse = new Response({
                text: data.text,
                timestamp: new Date()
            });
            
            // Save to database
            await newResponse.save();
            
            // Broadcast to ALL connected clients (real-time update)
            io.emit('newResponse', newResponse);
            
            console.log('New response saved to database:', data.text);
        } catch (error) {
            console.error('Error saving response:', error);
        }
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (PORT === 3000) {
        console.log('Open your browser and go to http://localhost:3000');
    }
});