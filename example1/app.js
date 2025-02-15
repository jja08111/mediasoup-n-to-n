import express from "express";
import https from "httpolyglot";
import path from "path";
import { Server } from "socket.io";
import { handleConnect } from "./src/worker.js";
import { tlsconfig } from "./config.js";

const __dirname = path.resolve();
const app = express();

app.get("*", (req, res, next) => {
  const path = "/room/";

  if (req.path.indexOf(path) == 0 && req.path.length > path.length)
    return next();

  res.send(
    `You need to specify a room name in the path e.g. 'https://127.0.0.1/sfu/room'`
  );
});

app.use("/room/:roomId", express.static(path.join(__dirname, "public")));

const httpsServer = https.createServer(tlsconfig, app);
httpsServer.listen(3000, () => {
  console.log("listening on port: " + 3000);
});

const io = new Server(httpsServer);

// socket.io namespace (could represent a room?)
const connections = io.of("/mediasoup");

connections.on("connection", async (socket) => handleConnect(socket));
