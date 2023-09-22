import { Popup, Button } from "react-chat-elements";

function popupSettings(username) {
  const popup = {
    show: true,
    header: "Account is Active",
    text: `Hey ${username}, you already have an account running.`,
  };
  return popup;
}
export default function DisplayPopup(props) {
  return <Popup popup={popupSettings(props.username)} />;
}
