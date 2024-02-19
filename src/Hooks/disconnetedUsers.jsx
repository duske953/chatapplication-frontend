import { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function useDisconnectedUser(setActiveUsers) {
  const [userIsDisconnected, setUserisDisconnected] = useState({
    disconnectedUser: [],
    active: true,
    disconnected: null,
  });
  useEffect(() => {
    function handleDisconnectedUser({ active, user, disconnected }) {
      setUserisDisconnected({
        disconnectedUser: user,
        active,
        disconnected,
      });
      if (disconnected) {
        setActiveUsers((draft) => {
          return draft.filter((ele, i) => ele.id !== user.id);
        });
      }
      setActiveUsers((draft) => {
        const foundUser = draft.find((ele) => ele.id === user.id);
        if (!foundUser) {
          // setUserisDisconnected({ ...userIsDisconnected, active: false });
          return draft;
        }
        foundUser.active = active;
      });
    }
    socket.on('user:disconnected', handleDisconnectedUser);
    return () => {
      socket.off('user:disconnected', handleDisconnectedUser);
    };
  }, []);
  return { userIsDisconnected, setUserisDisconnected };
}
