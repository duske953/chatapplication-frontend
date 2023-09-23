import { useEffect, useState, useRef } from "react";
import {
  Form,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { MessageList } from "react-chat-elements";
import { Input } from "react-chat-elements";
import { Button } from "react-chat-elements";
import { useDebounce } from "use-debounce";
import { socket } from "../socket";
import { AiOutlineSend } from "react-icons/ai";
import { SystemMessage } from "react-chat-elements";

function filterMessagesData(messageData, params, sender) {
  return messageData
    .filter(
      (ele, i) =>
        ele.senderId === params.profile || ele.receiverId === params.profile
    )
    .map((ele, i) => {
      return {
        type: ele.type,
        text: ele.text,
        position: ele.senderId === sender?.id ? "left" : "right",
        title: ele.title,
      };
    });
}

export default function MessageBoxRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [userValid, setUserValid] = useState(true);
  const [showSystemMessage, setShowSystemMessage] = useState(false);
  const [value] = useDebounce(inputText, 1000);
  const [message, setMessage] = useState([]);
  const {
    messageHeader: { sender, receiver },
    userIsDisconnected: { disconnectedUser, active, disconnected },
    setUserisDisconnected,
  } = useOutletContext();
  const [typing, setIsTyping] = useState({
    typing: false,
    sid: null,
  });
  const inputRef = useRef(null);
  function handleChange(e) {
    socket.emit("userIsTyping", {
      sid: sender?.id,
      rid: receiver?.id,
      typing: true,
    });
    setInputText(e.target.value);
  }

  function handleSubmit(e) {
    if (
      (disconnectedUser.id === params.profile && active === false) ||
      userValid === false
    ) {
      setShowSystemMessage(true);
      return;
    }
    socket.emit("send:message", {
      type: "text",
      text: inputText,
      senderId: sender.id,
      receiverId: receiver.id,
      position: "left",
      read: true,
      title:sender.name
    });
    setMessage([
      ...message,
      { position: "left", type: "text", text: inputText,title:sender.name },
    ]);
    // setInputText("");
    inputRef.current.value = "";
  }

  useEffect(() => {
    function handleIsUserStillVald(response) {
      if (response.foundUser === "no-user") return setUserValid(false);
      if (response.foundUser) return setUserValid(true);
    }
    socket.emit("isUserStillValid", params.profile);
    socket.on("response:userIsStillValid", handleIsUserStillVald);

    return () => {
      socket.off("response:userIsStillValid", handleIsUserStillVald);
    };
  }, [params.profile, active]);

  useEffect(() => {
    socket.emit("userIsTyping", {
      sid: sender?.id,
      rid: receiver?.id,
      typing: false,
    });
  }, [value]);

  useEffect(() => {
    function handleAllMessages(msg) {
      setMessage(filterMessagesData(msg.messageData, params, msg.currentUser));
    }
    function handleUserIsTyping(msg) {
      setIsTyping(msg);
    }
    socket.on("sendAllMessages", handleAllMessages);
    socket.on("userIsTyping", handleUserIsTyping);
    return () => {
      socket.off("sendAllMessages", handleAllMessages);
      socket.off("userIsTyping", handleUserIsTyping);
    };
  }, []);

  useEffect(() => {
    if (disconnected && disconnectedUser.id === params.profile) {
      navigate("/", { replace: true });
    }
    if (disconnectedUser.id === params.profile && userValid) {
      setShowSystemMessage(false);
    }
  }, [disconnectedUser, params.profile, userValid]);

  useEffect(() => {
    function handleAllMessages(messageData) {
      setMessage(filterMessagesData(messageData, params, sender));
    }
    socket.on("sendMessages", handleAllMessages);
    return () => {
      socket.off("sendMessages", handleAllMessages);
    };
  }, [params.profile, receiver, sender]);

  useEffect(() => {
    function handleSentMessage(msg) {
      if (msg.senderId === params.profile)
        setMessage([...message, { ...msg, position: "right" }]);
    }
    socket.on("send:message", handleSentMessage);
    return () => {
      socket.off("send:message", handleSentMessage);
    };
  }, [message, params.profile]);
  console.log(userValid);
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
                ? "Offline"
                : typing.typing && typing.sid === params.profile
                ? "Typing"
                : "Active now"}
            </p>
          </div>
        </div>
        {showSystemMessage && (
          <SystemMessage
            text={`${disconnectedUser.name} is currently not online and so, Messages can't be delievered at this time`}
          />
        )}
        <MessageList
          className="chats-section__message-list"
          lockable={true}
          toBottomHeight={"100%"}
          dataSource={message}
        />
        <Form
          className="chats-section__input-box"
          method="get"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Start a conversation"
            referance={inputRef}
            multiline={true}
            onChange={handleChange}
            className="chats-section__chat-input"
            minHeight={30}
            inputStyle={{
              fontSize: "2rem",
              height: "44px",
            }}
            rightButtons={
              <Button
                type="outlined"
                className="chats-section__msg-send-btn"
                disabled={inputText.length > 0 ? false : true}
                title="submit"
                icon={{
                  size: 35,
                  float: "right",
                  component: <AiOutlineSend />,
                }}
              />
            }
          />
        </Form>
      </div>
    </>
  );
}
