"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const UserManager_1 = require("./managers/UserManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
    console.log("A user joined");
    const userManager = new UserManager_1.UserManager();
    const userId = userManager.addUser(socket);
    socket.send(JSON.stringify({ type: "user-joined", payload: { userId } }));
});
