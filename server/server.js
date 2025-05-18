
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins (for development only)
    methods: ["GET", "POST"]
  }
});

let waitingUsers = [];             // List of users waiting to be paired
let pairs = {};                    // Map of socketId → partnerSocketId
let userData = {};                 // Map of socketId → { username }

function addToWaiting(socketId) {
  if (!waitingUsers.includes(socketId)) {
    waitingUsers.push(socketId);
  }
  tryToMatch();
}

function tryToMatch() {
  while (waitingUsers.length >= 2) {
    const user1 = waitingUsers.shift();
    const user2 = waitingUsers.shift();

    // Check if both users are still connected
    const socket1 = io.sockets.sockets.get(user1);
    const socket2 = io.sockets.sockets.get(user2);

    if (socket1 && socket2) {
      pairs[user1] = user2;
      pairs[user2] = user1;

      // Notify both users they are paired
      socket1.emit("paired", { partnerName: userData[user2]?.username || "Peer" });
      socket2.emit("paired", { partnerName: userData[user1]?.username || "Peer" });
    } else {
      if (socket1) addToWaiting(user1);
      if (socket2) addToWaiting(user2);
    }
  }
}

io.on("connection", (socket) => {
  console.log("✅ Connected:", socket.id);

  socket.on("join", ({ username }) => {
    userData[socket.id] = { username: username || "Anonymous" };
    addToWaiting(socket.id);
    socket.emit("waiting");
  });

  socket.on("chatMessage", ({ text }) => {
    const partnerId = pairs[socket.id];
    if (partnerId && io.sockets.sockets.get(partnerId)) {
      io.to(partnerId).emit("chatMessage", {
        sender: userData[socket.id]?.username || "Anonymous",
        text,
      });
    }
  });

  socket.on("skip", () => {
    const partnerId = pairs[socket.id];

    // Notify and re-add partner
    if (partnerId && io.sockets.sockets.get(partnerId)) {
      io.to(partnerId).emit("partnerDisconnected");
      delete pairs[partnerId];
      addToWaiting(partnerId);
    }

    // Remove current user from pair and re-add
    delete pairs[socket.id];
    addToWaiting(socket.id);
    socket.emit("waiting");
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    const partnerId = pairs[socket.id];

    if (partnerId && io.sockets.sockets.get(partnerId)) {
      io.to(partnerId).emit("partnerDisconnected");
      delete pairs[partnerId];
      addToWaiting(partnerId);
    }

    // Clean up
    delete pairs[socket.id];
    delete userData[socket.id];
    waitingUsers = waitingUsers.filter(id => id !== socket.id);
  });
});

server.listen(5015, () => {
  console.log("🚀 Server running at http://localhost:5015");
});
