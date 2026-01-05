import { socket } from "./socket";

export const joinRoom = (roomId) => {
  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("joinRoom", { roomId });
};

export const leaveRoom = (roomId) => {
  socket.emit("leaveRoom", { roomId });
};
