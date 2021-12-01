import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  setInterval(function(){
    socket.emit('chord', {x: Math.random() * 1000, y: Math.random() * 1000, z: Math.random() * 1000, s: 0});
  }, 1000);
});

httpServer.listen(3000);