import { useEffect, useRef } from 'react';
import { socket } from '../socket';

export default function useGetActiveUsers(setActiveUsers, activeUsers) {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  let refCurrentUser = useRef(null);
  useEffect(() => {
    function getActiveUsers({ users }) {
      refCurrentUser.current = users.find(
        (ele) => ele.refId === socket.auth.token
      );
      setActiveUsers((draft) => {
        draft = users.filter((ele) => ele.refId !== socket.auth.token);
        return draft;
      });
    }
    socket.on('active:users', getActiveUsers);
    return () => {
      socket.off('active:users', getActiveUsers);
    };
  }, [activeUsers, setActiveUsers]);
  return { refCurrentUser };
}
