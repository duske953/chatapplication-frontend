import { socket } from "../socket";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { useParams } from "react-router-dom";

function isChatActive(param, messages) {
  return param.profile === messages.senderId;
}

export default function useHandleMessages() {
  const param = useParams();
  let refLatestMessage = useRef(null);
  const [getMessage, setGetMessage] = useImmer([]);
  useEffect(() => {
    function handleReceivedMessages({ messages, sid }) {
      socket.emit("messageData", messages);
      const chatActive = isChatActive(param, messages);
      if (chatActive) {
        messages.read = true;
      }
      if (getMessage.length === 0) {
        return setGetMessage((draft) => {
          draft.push({
            new: chatActive ? false : true,
            id: sid,
            msg: [messages],
          });
        });
      }
      if (getMessage.length !== 0) {
        const index = getMessage.findIndex((ele, i) => ele.id === sid);
        if (index === -1) {
          return setGetMessage((draft) => {
            draft.forEach((ele, i) => (ele.new = false));
            draft.push({
              new: chatActive ? false : true,
              id: sid,
              msg: [messages],
            });
          });
        } else {
          return setGetMessage((draft) => {
            draft.forEach((ele, i) => (ele.new = false));
            draft[index].new = chatActive ? false : true;
            draft[index].msg.push(messages);
          });
        }
      }
    }
    socket.emit("receivedMessageAttr", {
      getMessage,
    });

    socket.on("messageAttr", handleReceivedMessages);
    return () => {
      socket.off("messageAttr", handleReceivedMessages);
    };
  }, [getMessage, param.profile]);
  return { getMessage, setGetMessage, refLatestMessage };
}
