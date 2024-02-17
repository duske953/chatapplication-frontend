import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
const NODEENV = import.meta.env.VITE_NODE_ENV;
export const socket = io(
  NODEENV === 'development'
    ? 'http://localhost:3000'
    : import.meta.env.VITE_BACKEND_URL,
  {
    withCredentials: true,
    auth: { token: uuidv4() },
  }
);
