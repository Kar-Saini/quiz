"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const QuizManager_1 = __importDefault(require("./QuizManager"));
const RoomManager_1 = __importDefault(require("./RoomManager"));
class UserManager {
    constructor() {
        this.users = [];
    }
    addUser(socket) {
        const userId = Math.ceil(Math.random() * 10000).toString();
        this.users.push({ userId, socket });
        console.log("UserId: " + userId + " joined.");
        this.initHandlers(socket);
        return userId;
    }
    broadcast(message, payload) {
        this.users.forEach((user) => {
            user.socket.send(JSON.stringify({ type: message, payload }));
        });
    }
    sendToRoomUsers(roomId, message, payload) {
        const room = RoomManager_1.default.getRoom(roomId);
        if (room) {
            room.userIds.forEach((userId) => {
                const user = this.users.find((u) => u.userId === userId);
                user === null || user === void 0 ? void 0 : user.socket.send(JSON.stringify({ type: message, payload }));
            });
        }
    }
    initHandlers(socket) {
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case "create-room":
                    const roomId = RoomManager_1.default.createRoom(message.payload.userId);
                    console.log("Room created with ID : " +
                        roomId +
                        " by user with ID : " +
                        message.payload.userId);
                    socket.send(JSON.stringify({ type: "room-created", payload: { roomId } }));
                    this.broadcast("admin-info", {
                        roomId,
                        adminUserId: message.payload.userId,
                    });
                    break;
                case "user-join-room":
                    const joinedRoomId = RoomManager_1.default.userJoinRoom(message.payload.roomId, message.payload.userId);
                    socket.send(JSON.stringify({
                        type: "room-joined",
                        payload: { roomId: joinedRoomId },
                    }));
                    const room = RoomManager_1.default.getRoom(message.payload.roomId);
                    const adminOfRoomUserId = room === null || room === void 0 ? void 0 : room.adminUser;
                    this.sendToRoomUsers(message.payload.roomId, "admin-info", {
                        roomId: message.payload.roomId,
                        adminUserId: adminOfRoomUserId,
                    });
                    this.sendToRoomUsers(message.payload.roomId, "update-users", {
                        users: room === null || room === void 0 ? void 0 : room.userIds,
                    });
                    break;
                case "user-exit-room":
                    RoomManager_1.default.userExitRoom(message.payload.roomId, message.payload.userId);
                    break;
                case "close-room":
                    RoomManager_1.default.closeRoom(message.payload.roomId, message.payload.userId);
                    break;
                case "start-quiz":
                    const newQuizId = QuizManager_1.default.startQuiz(message.payload.roomId);
                    this.sendToRoomUsers(message.payload.roomid, "quiz-started", {
                        quizId: newQuizId,
                    });
            }
        };
    }
}
exports.UserManager = UserManager;
