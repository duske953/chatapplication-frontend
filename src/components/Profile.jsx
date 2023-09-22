import { Avatar } from "react-chat-elements";

export default function Profile(props) {
  return (
    <div className="chats-section__profile-box">
      <Avatar src={props.img} alt="avatar" size="large" type="circle" />
      <p>{props.name}</p>
    </div>
  );
}
