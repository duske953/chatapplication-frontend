import { Popup, Button } from 'react-chat-elements';

function popupSettings(header, text) {
  const popup = {
    show: true,
    header,
    text,
  };
  return popup;
}
export default function DisplayPopup({ header, text }) {
  return <Popup popup={popupSettings(header, text)} />;
}
