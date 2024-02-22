import { socket } from '../socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import arraySort from 'array-sort';
import { useRef } from 'react';
function filterSentMessages(msg, refCurrentUser, profile) {
  return msg.filter(
    (ele) =>
      ele.receiverId === profile && refCurrentUser.current.id === ele.senderId
  );
}

function filterReceivedMessages(msg, refCurrentUser, profile) {
  return msg.filter(
    (ele) =>
      ele.receiverId === refCurrentUser.current.id && ele.senderId === profile
  );
}

export default function useHandleMessages(refCurrentUser, setActiveUsers) {
  const params = useParams();
  const [sentMessage, setSentMessage] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState([]);
  const [messageAttr, setMessageAttr] = useState([]);
  const [messages, setMessages] = useState([]);
  const timeRef = useRef(null);
  const timeSentRef = useRef(null);
  const timeReceivedRef = useRef(null);
  const elemRef = useRef(null);

  useEffect(() => {
    function handleAllMessages(msg) {
      setSentMessage(
        filterSentMessages(msg.sentMessages, refCurrentUser, params.profile)
      );

      setReceivedMessage(
        filterReceivedMessages(
          msg.receivedMessages,
          refCurrentUser,
          params.profile
        )
      );
      setMessageAttr(msg.messageAttr);
      timeRef.current = setTimeout(() => {
        elemRef.current?.scroll({
          top: elemRef.current.scrollHeight,
          behavior: 'instant',
        });
      }, 100);
    }
    socket.emit('fetchAllMessages');
    socket.on('sendAllMessages', handleAllMessages);

    return () => {
      clearTimeout(timeRef.current);
      socket.off('sendAllMessages', handleAllMessages);
    };
  }, [params.profile, refCurrentUser]);

  useEffect(() => {
    const concatArray = filterSentMessages(
      sentMessage,
      refCurrentUser,
      params.profile
    ).concat(
      filterReceivedMessages(receivedMessage, refCurrentUser, params.profile)
    );
    setMessages(arraySort(concatArray, 'time'));
  }, [sentMessage, receivedMessage, params.profile, refCurrentUser]);

  useEffect(() => {
    function handleReceivedMessage(msg) {
      setActiveUsers((users) => {
        return users.map((ele) => {
          if (ele.id === msg.senderId) {
            return {
              ...ele,
              msgSent: ele.id === params.profile ? false : true,
            };
          }
          return { ...ele, msgSent: false };
        });
      });
      socket.emit('received:message', {
        msg: { ...msg },
        messageAttr: {
          ...msg,
          new: msg.senderId === params.profile ? false : true,
        },
      });

      timeReceivedRef.current = setTimeout(() => {
        elemRef.current?.scroll({
          top: elemRef.current.scrollHeight,
          behavior: 'instant',
        });
      }, 5);
      setMessageAttr([
        ...messageAttr,
        { ...msg, new: msg.senderId === params.profile ? false : true },
      ]);
      return setReceivedMessage([...receivedMessage, { ...msg, new: true }]);
    }

    socket.on('received:message', handleReceivedMessage);
    return () => {
      clearTimeout(timeReceivedRef);
      socket.off('received:message', handleReceivedMessage);
    };
  }, [receivedMessage, setActiveUsers, params.profile, messageAttr]);

  useEffect(() => {
    function handleSentMessage({ msg }) {
      setSentMessage(msg);

      timeSentRef.current = setTimeout(() => {
        elemRef.current.scroll({
          top: elemRef.current.scrollHeight,
          behavior: 'instant',
        });
      }, 5);
    }
    socket.on('sent:message', handleSentMessage);
    return () => {
      clearTimeout(timeSentRef.current);
      socket.off('sent:message', handleSentMessage);
    };
  }, []);

  return { messageAttr, messages, setMessageAttr, elemRef };
}
