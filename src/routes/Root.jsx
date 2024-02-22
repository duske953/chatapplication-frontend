import { useEffect, useState } from 'react';
import useGetActiveUsers from '../Hooks/getActiveUsers';
import useIsClientAlreadyConnected from '../Hooks/IsClientConnected';
import useDisconnectedUser from '../Hooks/disconnetedUsers';
import _, { set } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useImmer } from 'use-immer';
import ChatsList from '../components/ChatsList';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import DisplayPopup from '../components/Popup';
import Profile from '../components/Profile';
import Offline from '../components/Offline';
import useHandleMessages from '../Hooks/handleMessages';
import ClipLoader from 'react-spinners/ClipLoader';
import { VscChromeClose } from 'react-icons/vsc';

export default function Root() {
  const navigate = useNavigate();

  const [messageHeader, setMessageHeader] = useState({
    sender: null,
    receiver: null,
  });

  function handleClickNav() {
    setToggleNav(!toggleNav);
  }

  const [activeUsers, setActiveUsers] = useImmer([]);
  const [toggleNav, setToggleNav] = useState(false);
  const [serverFull, setServerFull] = useState(false);
  const [userId, setUserId] = useState(null);
  const { refCurrentUser } = useGetActiveUsers(setActiveUsers, activeUsers);
  const userIsConnected = useIsClientAlreadyConnected();
  const { userIsDisconnected, setUserisDisconnected } = useDisconnectedUser(
    setActiveUsers,
    activeUsers
  );
  const params = useParams();
  const { messageAttr, messages, setMessageAttr, elemRef } = useHandleMessages(
    refCurrentUser,
    setActiveUsers
  );

  const isConnected = useIsClientAlreadyConnected();

  useEffect(() => {
    setActiveUsers((draft) => {
      draft?.sort((a, b) => {
        let objA = messageAttr.findLast((ele) => ele.senderId === a.id);
        let objB = messageAttr.findLast((ele) => ele.senderId === b.id);
        if (params.profile === userId) return 0;
        if (objA?.time > objB?.time) return -1;
        if (objB?.time > objA?.time) return 1;
        return 0;
      });
    });
  }, [messageAttr, setActiveUsers, params.profile, userId]);

  useEffect(() => {
    socket.emit('isUserStillValid', params.profile);
    function handleResponeIsUserStillValid({ foundUser }) {
      if (foundUser === 'no-user') {
        navigate('/', { replace: true });
        return true;
      }
      setMessageHeader({
        sender: refCurrentUser.current,
        receiver: foundUser[0],
      });
      return true;
    }
    socket.once('response:userIsStillValid', handleResponeIsUserStillValid);
    return () => {
      socket.off('response:userIsStillValid', handleResponeIsUserStillValid);
    };
  }, []);

  useEffect(() => {
    function handleServerFull() {
      setServerFull(true);
    }

    socket.on('server:full', handleServerFull);
    return () => socket.on('server:full', handleServerFull);
  }, []);

  function handleChatClick(userId) {
    setUserId(userId);
    setMessageAttr((attr) => {
      return attr.map((ele) => {
        if (ele.senderId === userId) {
          socket.emit('seen:message', { id: ele.senderId, new: false });
          return { ...ele, new: false };
        }
        return ele;
      });
    });

    const matchMedia = window.matchMedia('(max-width:43.75em)');
    matchMedia.matches && setToggleNav(!toggleNav);
    const foundUser = activeUsers.find((ele) => ele.id === userId);
    if (foundUser.active && params.profile !== userId) {
      setMessageHeader({
        sender: refCurrentUser.current,
        receiver: foundUser,
      });
      return navigate(`/chats/${userId}`);
    }
  }

  if (serverFull)
    return (
      <DisplayPopup
        header="Server full"
        text="This chat room is currently at its maximum capacity. Please try again later"
      />
    );
  if (isConnected)
    return (
      <DisplayPopup
        header="Account is Active"
        text={`Hey ${isConnected.name}, You already have an account running`}
      />
    );

  if (!refCurrentUser.current)
    return (
      <div className="server-loading">
        <p>Please wait while we connect to our servers</p>
        <ClipLoader
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  return (
    <>
      <section className="chats-section">
        <div className="chats-section__container">
          <div
            className={
              toggleNav
                ? 'chats-section__ut-cs chats-section__ut-cs--active'
                : 'chats-section__ut-cs'
            }
          >
            <VscChromeClose
              className="chats-section__icon-close"
              onClick={() => setToggleNav(!toggleNav)}
            />
            <Profile
              img={refCurrentUser.current?.image}
              name={_.truncate(refCurrentUser.current?.name, { length: '14' })}
            />
            <div className="chats-section__category">
              {activeUsers.length !== 0 && (
                <p className="chats-section__active">Active</p>
              )}
            </div>
            <ul className="chats-section__chats-box">
              {activeUsers.length === 0 && <Offline />}
              {activeUsers.map((e) => (
                <ChatsList
                  {...e}
                  getMessage={messageAttr}
                  key={uuidv4()}
                  handleChatClick={handleChatClick}
                />
              ))}
            </ul>
          </div>
          <>
            <Outlet
              context={{
                messageHeader,
                userIsDisconnected,
                setUserisDisconnected,
                messages,
                elemRef,
                toggleNav,
                handleClickNav,
                refCurrentUser,
              }}
            />
          </>
        </div>
      </section>
    </>
  );
}
