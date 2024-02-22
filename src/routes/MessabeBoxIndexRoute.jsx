import wavyTech from '../assets/Wavy_Tech-07_Single-01.jpg';
import { useOutletContext } from 'react-router-dom';
import { CiMenuBurger } from 'react-icons/ci';
export default function IndexMessageBoxRoute() {
  const { toggleNav, handleClickNav } = useOutletContext();
  return (
    <section style={{ position: 'relative' }}>
      <div className="chats-section__empty-chat">
        <>
          <CiMenuBurger
            style={{ top: '1rem', transform: 'translateY(0)' }}
            className={
              toggleNav
                ? 'chats-section__icon-toggle chats-section__icon-toggle--active'
                : 'chats-section__icon-toggle'
            }
            onClick={handleClickNav}
          />
          <img className="chats-section__empty-chat-img" src={wavyTech} />
          <p>Your chats Will appear here</p>
        </>
      </div>
    </section>
  );
}
