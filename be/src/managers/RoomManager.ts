import { Socket } from "socket.io";
import { User } from "./UserManager";

interface Room {
  roomId: string;
  adminUser: string;
  userIds: string[];
}
export class RoomManager {
  private rooms: Room[];
  constructor() {
    this.rooms = [];
  }

  getRoom(roomId: string) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    return room;
  }

  createRoom(adminUser: string) {
    const roomId = Math.ceil(Math.random() * 100000).toString();
    this.rooms.push({ roomId, adminUser, userIds: [] });
    return roomId;
  }
  userJoinRoom(roomId: string, userId: string) {
    const room = this.getRoom(roomId);
    if (!room) {
      console.log("Room ID: `" + roomId + " doesnt exist");
      return;
    }
    room.userIds.push(userId);
    console.log("User ID : " + userId + " joined Room ID : " + roomId);
    return roomId;
  }
  userExitRoom(roomId: string, userId: string) {
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
  closeRoom(roomId: string, userId: string) {
    const room = this.getRoom(roomId);
    if (room?.adminUser !== userId) {
      console.log("UserID : " + userId + " is not the admin for this room");
      return;
    }
    this.rooms = this.rooms.filter((room) => {
      room.roomId !== roomId;
    });
    console.log("Room ID : " + roomId + " closed");
  }
}

const roomManager = new RoomManager();

export default roomManager;
