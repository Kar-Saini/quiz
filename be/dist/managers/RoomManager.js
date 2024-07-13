"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
class RoomManager {
    constructor() {
        this.rooms = [];
    }
    getRoom(roomId) {
        const room = this.rooms.find((room) => room.roomId === roomId);
        return room;
    }
    createRoom(adminUser) {
        const roomId = Math.ceil(Math.random() * 100000).toString();
        this.rooms.push({ roomId, adminUser, userIds: [] });
        return roomId;
    }
    userJoinRoom(roomId, userId) {
        const room = this.getRoom(roomId);
        if (!room) {
            console.log("Room ID: `" + roomId + " doesnt exist");
            return;
        }
        room.userIds.push(userId);
        console.log("User ID : " + userId + " joined Room ID : " + roomId);
        return roomId;
    }
    userExitRoom(roomId, userId) {
        const room = this.getRoom(roomId);
        if (!room) {
            console.log("Room ID: " + roomId + " doesnt exist");
            return;
        }
        room.userIds = room.userIds.filter((existingUserId) => {
            existingUserId !== userId;
        });
        console.log("User ID : " + userId + " left Room ID : " + roomId);
    }
    closeRoom(roomId, userId) {
        const room = this.getRoom(roomId);
        if ((room === null || room === void 0 ? void 0 : room.adminUser) !== userId) {
            console.log("UserID : " + userId + " is not the admin for this room");
            return;
        }
        this.rooms = this.rooms.filter((room) => {
            room.roomId !== roomId;
        });
        console.log("Room ID : " + roomId + " closed");
    }
}
exports.RoomManager = RoomManager;
const roomManager = new RoomManager();
exports.default = roomManager;
