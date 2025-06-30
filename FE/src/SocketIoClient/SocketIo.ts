import { io, Socket } from 'socket.io-client';

const apiUrl = process.env.REACT_APP_API_URL as string; 
const socket: Socket = io(apiUrl);
if (typeof window !== 'undefined') {
  (window as any).socket = socket;
}
export default socket;
