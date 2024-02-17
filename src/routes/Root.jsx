import { useEffect, useState } from 'react';
import useGetActiveUsers from '../Hooks/getActiveUsers';
import useIsClientAlreadyConnected from '../Hooks/IsClientConnected';
import useDisconnectedUser from '../Hooks/disconnetedUsers';
import useHandleMessages from '../Hooks/handleMessages';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useImmer } from 'use-immer';
import ChatsList from '../components/ChatsList';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import DisplayPopup from '../components/Popup';
import Profile from '../components/Profile';
import Offline from '../components/Offline';
import { CiMenuBurger } from 'react-icons/ci';
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

  const { getMessage, setGetMessage } = useHandleMessages();
  const [activeUsers, setActiveUsers] = useImmer([]);
  const [toggleNav, setToggleNav] = useState(false);
  const { refCurrentUser } = useGetActiveUsers(setActiveUsers, activeUsers);
  const userIsConnected = useIsClientAlreadyConnected();
  const { userIsDisconnected, setUserisDisconnected } = useDisconnectedUser(
    setActiveUsers,
    activeUsers
  );
  const params = useParams();
  useEffect(() => {
    socket.emit('fetchAllMessages');
    function handleSendAllMessages({ messageAttr }) {
      setGetMessage(messageAttr);
    }
    socket.once('sendAllMessages', handleSendAllMessages);
    return () => {
      socket.off('sendAllMessages', handleSendAllMessages);
    };
  }, [setGetMessage]);

  useEffect(() => {
    socket.emit('isUserStillValid', params.profile);
    function handleResponeIsUserStillValid({ foundUser }) {
      if (foundUser === 'no-user') {
        return navigate('/', { replace: true });
      }
      setMessageHeader({
        sender: refCurrentUser.current,
        receiver: foundUser[0],
      });
    }
    socket.once('response:userIsStillValid', handleResponeIsUserStillValid);
    return () => {
      socket.off('response:userIsStillValid', handleResponeIsUserStillValid);
    };
  }, [params.profile, navigate, refCurrentUser]);

  useEffect(() => {
    setActiveUsers((draft) => {
      draft?.sort((a, b) => {
        let objA = getMessage.find((ele) => ele.id === a.id);
        let objB = getMessage.find((ele) => ele.id === b.id);
        if (objA?.new && !objB?.new) return -1;
        if (!objA?.new && objB?.new) return 1;
        return 0;
      });
    });
  }, [getMessage, setActiveUsers]);

  function handleChatClick(userId) {
    const matchMedia = window.matchMedia('(max-width:43.75em)');
    matchMedia.matches && setToggleNav(!toggleNav);
    const receiver = activeUsers.find((ele) => ele.id === userId);
    setMessageHeader({
      sender: refCurrentUser.current,
      receiver,
    });
    const foundUser = getMessage.findIndex((ele) => ele.id === userId);
    console.log(getMessage);
    setGetMessage((draft) => {
      draft[foundUser]?.msg
        .filter((ele) => ele.read === false)
        .forEach((ele) => (ele.read = true));
    });
    navigate(`/chats/${userId}`);
  }

  // if (!refCurrentUser.current)
  //   return (
  //     <div className="server-loading">
  //       <p>Please wait while we connect to our servers</p>
  //       <DotLoader
  //         loading={true}
  //         aria-label="loading spinner"
  //         size={150}
  //         cssOverride={override}
  //       />
  //     </div>
  //   );
  return (
    <>
      <section className="chats-section">
        <div className="chats-section__container">
          <CiMenuBurger
            className={
              toggleNav
                ? 'chats-section__icon-toggle chats-section__icon-toggle--active'
                : 'chats-section__icon-toggle'
            }
            onClick={handleClickNav}
          />
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
                  getMessage={getMessage}
                  key={uuidv4()}
                  handleChatClick={handleChatClick}
                />
              ))}
            </ul>
            {userIsConnected && (
              <DisplayPopup username={userIsConnected.name} />
            )}
          </div>
          <Outlet
            context={{
              messageHeader,
              userIsDisconnected,
              setUserisDisconnected,
            }}
          />
          {/* <footer className="chats-section__footer">
            <p>Created with love by <a rel="noopener" target="_blank" href="https://eloho-ken.b4a.app">Eloho Kennedy</a></p>
          </footer> */}
        </div>
      </section>
    </>
  );
}
