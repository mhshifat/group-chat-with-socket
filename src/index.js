const path = require("path");
const express = require("express");
const socket = require("socket.io");

const app = express();
const port = process.env.PORT || 5000;
const connectedSocket = new Set();

app.use(express.static(path.join(__dirname, "..", "public")));

const server = app.listen(port, () => {
  console.log(`🚀 Server is running on ${port}!`);
});

const io = socket(server);

io.on("connection", onConnected);

function onConnected(socket) {
  connectedSocket.add(socket.id);
  io.emit("clients-total", connectedSocket.size);

  socket.on("disconnect", () => {
    connectedSocket.delete(socket.id);
    io.emit("clients-total", connectedSocket.size);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
