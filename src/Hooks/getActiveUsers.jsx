import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

export default function useGetActiveUsers(setActiveUsers, activeUsers) {
  const navigate = useNavigate();
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  let refCurrentUser = useRef(null);
  useEffect(() => {
    function getActiveUsers({ users, foundClient }) {
      refCurrentUser.current = users.find(
        (ele, _) => ele.refId === socket.auth.token
      );
      setActiveUsers((draft) => {
        draft = users.filter((ele, _) => ele.refId !== socket.auth.token);
        return draft;
      });
    }
    socket.on("active:users", getActiveUsers);
    return () => {
      socket.off("active:users", getActiveUsers);
    };
  }, [activeUsers]);
  return { refCurrentUser };
}
