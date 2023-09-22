import _ from "lodash";
import { ChatList } from "react-chat-elements";
export default function ChatsList(props) {
  return (
    <>
      <ChatList
        className="chats-section__chat-list"
        onClick={() => props.handleChatClick(props.id)}
        dataSource={[
          {
            title: props.name,
            avatar: props.image,
            date: null,
            unread: props.getMessage
              .filter((ele, i) => ele.id === props.id)
              .map(
                (ele, i) =>
                  ele.msg.filter((msg, i) => msg.read === false).length
              ),
            subtitle: props.getMessage
              .filter((ele, i) => ele.id === props.id)
              .map((ele, i) => _.truncate(ele.msg.slice(-1)[0].text))[0],

            statusColor: props.active ? "green" : "red",
            avatarFlexible: true,
          },
        ]}
      />
    </>
  );
}
