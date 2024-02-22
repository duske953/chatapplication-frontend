import wavyTech from '../assets/Wavy_Tech-07_Single-01.jpg';
import { useOutletContext } from 'react-router-dom';
import { CiMenuBurger } from 'react-icons/ci';
export default function IndexMessageBoxRoute() {
  const { toggleNav, handleClickNav } = useOutletContext();
  return (
    <section style={{ position: 'relative', width: '100%' }}>
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
        <footer className="chats-section__footer">
          <p>
            Created with love by{' '}
            <a
              rel="noreferrer"
              target="_blank"
              href="https://eloho-ken.b4a.app"
            >
              Eloho Kennedy
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
