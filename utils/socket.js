import { io } from "socket.io-client";

const socket = io(
  "https://startup-collaboration-platform-backend.onrender.com",
  {
    autoConnect: false,
  }
);

export default socket;