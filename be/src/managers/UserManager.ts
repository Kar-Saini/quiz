import { Socket } from "socket.io";
import { WebSocket } from "ws";
import RoomManager from "./RoomManager";
import quizManager, { QuizManager } from "./QuizManager";
import roomManager from "./RoomManager";

export interface User {
  userId: string;
  socket: WebSocket;
}
export class UserManager {
  private users: User[];
  constructor() {
    this.users = [];
  }
  addUser(socket: WebSocket) {
    const userId = Math.ceil(Math.random() * 10000).toString();
    this.users.push({ userId, socket });
    console.log("UserId: " + userId + " joined.");
    this.initHandlers(socket);
    return userId;
  }
  broadcast(message: string, payload: object) {
    this.users.forEach((user) => {
      user.socket.send(JSON.stringify({ type: message, payload }));
    });
  }
  sendToRoomUsers(roomId: string, message: string, payload: object) {
    const room = roomManager.getRoom(roomId);
    if (room) {
      room.userIds.forEach((userId) => {
        const user = this.users.find((u) => u.userId === userId);
        user?.socket.send(JSON.stringify({ type: message, payload }));
      });
    }
  }
  initHandlers(socket: WebSocket) {
    socket.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "create-room":
          const roomId = roomManager.createRoom(message.payload.userId);
          console.log(
            "Room created with ID : " +
              roomId +
              " by user with ID : " +
              message.payload.userId
          );
          socket.send(
            JSON.stringify({ type: "room-created", payload: { roomId } })
          );
          this.broadcast("admin-info", {
            roomId,
            adminUserId: message.payload.userId,
          });
          break;
        case "user-join-room":
          const joinedRoomId = roomManager.userJoinRoom(
            message.payload.roomId,
            message.payload.userId
          );
          socket.send(
            JSON.stringify({
              type: "room-joined",
              payload: { roomId: joinedRoomId },
            })
          );
          const room = roomManager.getRoom(message.payload.roomId);
          const adminOfRoomUserId = room?.adminUser;
          this.sendToRoomUsers(message.payload.roomId, "admin-info", {
            roomId: message.payload.roomId,
            adminUserId: adminOfRoomUserId,
          });
          this.sendToRoomUsers(message.payload.roomId, "update-users", {
            users: room?.userIds,
          });
          break;

        case "user-exit-room":
          roomManager.userExitRoom(
            message.payload.roomId,
            message.payload.userId
          );
          break;
        case "close-room":
          roomManager.closeRoom(message.payload.roomId, message.payload.userId);
          break;

        case "start-quiz":
          const newQuizId = quizManager.startQuiz(message.payload.roomId);
          this.sendToRoomUsers(message.payload.roomid, "quiz-started", {
            quizId: newQuizId,
          });
      }
    };
  }
}
