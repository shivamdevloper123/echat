const express = require('express');
const cors = require('cors');
const http = require('http');  // Required to use the same server for both express and socket.io
const { Server } = require('socket.io');

const app = express();

// Use CORS to allow cross-origin requests
app.use(cors({
  origin: "http://127.0.0.1:5500",  // Allow the frontend address
  methods: ["GET", "POST"],
  credentials: true
}));

// Create an HTTP server using Express
const server = http.createServer(app);

// Attach Socket.IO to the same HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",  // Allow the frontend address
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Track connected users
const users = {};

// When a user connects
io.on('connection', (socket) => {


  // When a new user joins
  socket.on('new-user-joined', (name) => {
   //  console.log("New user:", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);  // Notify others that a new user joined
  });

  // When a user sends a message
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });  // Broadcast the message to other users
  });

  // When a user disconnects
  socket.on('disconnect', () => {
   //  console.log("Left", users[socket.id]);
    socket.broadcast.emit('user-left', users[socket.id]);
    delete users[socket.id];  // Remove the user from the list
  });
});

// Start the server on port 8001
server.listen(8001, () => {
  console.log("Server is running on port 8001");
});
