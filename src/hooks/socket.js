import { io } from "socket.io-client";
import { BASE_URL } from "./AxiosInstance";

class SocketIO {
  static instance = null; // Lưu instance duy nhất

  constructor() {
    if (!SocketIO.instance) {
      this.socket = io(BASE_URL, {
        reconnection: true,
        reconnectionAttempts: 1000,
      });
      SocketIO.instance = this; // Gán instance để tái sử dụng
    }
    return SocketIO.instance;
  }
}

export default new SocketIO(); // Xuất instance duy nhất
