import wavyBus from "../assets/Wavy_Bus-35_Single-06.jpg";
export default function Offline() {
  return (
    <div className="chats-section__offline">
      {/* <img src={wavyBus} alt="No connected user" /> */}
      <p>
        There are currently no users online. It'll popup here when a user comes
        online
      </p>
    </div>
  );
}
