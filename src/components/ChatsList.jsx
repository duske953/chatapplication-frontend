/* eslint-disable react/prop-types */
import _ from 'lodash';
import { ChatList } from 'react-chat-elements';
export default function ChatsList(props) {
  function getDate(id, getMessage) {
    const foundMessage = getMessage
      .filter((ele) => ele.senderId === props.id)
      .slice(-1)[0];
    if (!foundMessage?.time) return null;
    return foundMessage?.time;
  }

  return (
    <>
      <ChatList
        className="chats-section__chat-list"
        onClick={() => props.handleChatClick(props.id)}
        dataSource={[
          {
            title: props.name,
            avatar: props.image,
            date: getDate(props.id, props.getMessage),
            unread: props.getMessage.filter(
              (ele) => ele.senderId === props.id && ele.new === true
            ).length,

            subtitle: props.getMessage
              .filter((ele) => ele.senderId === props.id)
              .slice(-1)[0]?.text,

            statusColor: props.active ? 'green' : 'red',
            avatarFlexible: true,
          },
        ]}
      />
    </>
  );
}
