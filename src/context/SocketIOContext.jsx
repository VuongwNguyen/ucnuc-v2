import React, { createContext, useContext, useEffect, useState } from "react";
import SocketIO from "./../hooks/socket";

const SocketIOContext = createContext();

export const SocketIOProvider = ({ children }) => {
  const socket = SocketIO.socket;
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onInitOrder = (data) => {
      console.log("init");
      setOrders([]); // Xóa danh sách hiện tại
      setOrders(data.list); // Set danh sách mới
    };

    // Lắng nghe sự kiện khi socket kết nối
    socket.on("initOrder", onInitOrder);

    // Cleanup để đảm bảo socket không bị lắng nghe nhiều lần khi component unmount
    return () => socket?.close(); // Hủy sự kiện khi component unmount
  }, []);

  return (
    <SocketIOContext.Provider value={{ socket, orders }}>
      {children}
    </SocketIOContext.Provider>
  );
};

export const useSocketIOContext = () => useContext(SocketIOContext);

export default SocketIOContext;
