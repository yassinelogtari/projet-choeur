import { io } from 'socket.io-client';

export const socket = io();
export let socketID = '';
socket.on('connect', () => {
    socketID = socket.id
})
