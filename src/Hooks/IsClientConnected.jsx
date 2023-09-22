import { socket } from "../socket";
import { useState, useEffect } from "react";

export default function useIsClientAlreadyConnected() {
  let [isConnected, setIsConnected] = useState(null);
  useEffect(() => {
    function ClientAlreadyConnected(msg) {
      if (msg) {
        setIsConnected(msg);
      }
    }
    socket.on("userAlreadyConnected", ClientAlreadyConnected);
    return () => {
      socket.off("userAlreadyConnected", ClientAlreadyConnected);
    };
  }, [isConnected]);
  return isConnected;
}
