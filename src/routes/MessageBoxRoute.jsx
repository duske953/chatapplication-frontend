/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { MessageList } from 'react-chat-elements';
import { Input } from 'react-chat-elements';
import { isMobile } from 'react-device-detect';
import { Button } from 'react-chat-elements';
import { useDebounce } from 'use-debounce';
import moment from 'moment';
import { socket } from '../socket';
import { AiOutlineSend } from 'react-icons/ai';
import { SystemMessage } from 'react-chat-elements';
import { CiMenuBurger } from 'react-icons/ci';

export default function MessageBoxRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [userValid, setUserValid] = useState(true);
  const [showSystemMessage, setShowSystemMessage] = useState(false);
  const [value] = useDebounce(inputText, 1000);
  const {
    messageHeader: { sender, receiver },
    userIsDisconnected: { disconnectedUser, active, disconnected },
    messages,
    elemRef,
    toggleNav,
    handleClickNav,
  } = useOutletContext();
  const [typing, setIsTyping] = useState({
    typing: false,
    sid: null,
  });
  const inputRef = useRef(null);
  function handleChange(e) {
    socket.emit('userIsTyping', {
      sid: sender?.id,
      rid: receiver?.id,
      typing: true,
    });
    setInputText(e.target.value);
  }
  function handleSubmit() {
    if (
      (disconnectedUser.id === params.profile && active === false) ||
      userValid === false
    ) {
      setShowSystemMessage(true);
      return;
    }

    socket.emit('send:message', {
      type: 'text',
      text: inputText,
      senderId: sender.id,
      receiverId: receiver.id,
      position: 'left',
      read: true,
      time: moment().format(),
      title: sender.name,
    });
    inputRef.current.value = '';
    inputRef.current.focus();
  }

  useEffect(() => {
    function handleIsUserStillVald(response) {
      if (response.foundUser === 'no-user' && response.id === params.profile) {
        navigate('/', { replace: true });
        return setUserValid(false);
      }
      if (response.foundUser) return setUserValid(true);
    }
    socket.emit('isUserStillValid', params.profile);
    socket.on('response:userIsStillValid', handleIsUserStillVald);

    return () => {
      socket.off('response:userIsStillValid', handleIsUserStillVald);
    };
  }, [params.profile, active, navigate]);

  useEffect(() => {
    socket.emit('userIsTyping', {
      sid: sender?.id,
      rid: receiver?.id,
      typing: false,
    });
  }, [value, receiver, sender]);

  useEffect(() => {
    function handleUserIsTyping(msg) {
      return setIsTyping(msg);
    }

    socket.on('userIsTyping', handleUserIsTyping);
    return () => socket.off('userIsTyping', handleUserIsTyping);
  });

  useEffect(() => {
    if (disconnected && disconnectedUser.id === params.profile) {
      navigate('/', { replace: true });
    }
    if (userValid) {
      setShowSystemMessage(false);
    }
  }, [disconnectedUser, params.profile, userValid, disconnected, navigate]);

  return (
    <>
      <div className="chats-section__message-box">
        <div className="chats-section__chat-receiver">
          <img
            src={receiver?.image}
            alt=""
            className="chats-section__chat-receiver-img"
          />
          <div className="chats-section__chat-receiver-details">
            <p>{receiver?.name}</p>
            <p>
              {(disconnectedUser.id === params.profile && active === false) ||
              userValid === false
                ? 'Offline'
                : typing.typing && typing.sid === params.profile
                ? 'Typing'
                : 'Active now'}
            </p>
          </div>
          <CiMenuBurger
            className={
              toggleNav
                ? 'chats-section__icon-toggle chats-section__icon-toggle--active'
                : 'chats-section__icon-toggle'
            }
            onClick={handleClickNav}
          />
        </div>
        {showSystemMessage && (
          <SystemMessage
            text={`${receiver.name} is currently not online and so, Messages can't be delievered at this time`}
          />
        )}

        <div className="chats-section__message-list-container">
          <div
            ref={elemRef}
            style={{
              paddingBottom: isMobile ? '16rem' : '10rem',
            }}
            className="chats-section__message-list-box"
          >
            <MessageList
              className="chats-section__message-list"
              lockable={false}
              toBottomHeight={300}
              dataSource={messages}
            />
          </div>
          <div className="chats-section__input-box" method="get">
            <Input
              placeholder="Start a conversation"
              inputMode="none"
              referance={inputRef}
              multiline={true}
              onChange={handleChange}
              className="chats-section__chat-input"
              minHeight={30}
              inputStyle={{
                fontSize: '2rem',
                height: '44px',
              }}
              rightButtons={
                <Button
                  onClick={handleSubmit}
                  type="outlined"
                  className={`chats-section__msg-send-btn ${
                    !inputText ? 'btn-cursor' : ''
                  }`}
                  disabled={inputText ? false : true}
                  title="submit"
                  icon={{
                    size: 35,
                    float: 'right',
                    component: <AiOutlineSend />,
                  }}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
