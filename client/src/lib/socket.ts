// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';   // Change in production

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });
  }
  return socket;
};