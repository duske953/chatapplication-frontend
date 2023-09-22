import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
export const socket = io("https://chatapp-backend.glitch.me", {
  withCredentials: true,
  auth: { token: uuidv4() },
});
