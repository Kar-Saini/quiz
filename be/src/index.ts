import { WebSocketServer } from "ws";
import { UserManager } from "./managers/UserManager";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
  console.log("A user joined");
  const userManager = new UserManager();
  const userId = userManager.addUser(socket);
  socket.send(JSON.stringify({ type: "user-joined", payload: { userId } }));
});
