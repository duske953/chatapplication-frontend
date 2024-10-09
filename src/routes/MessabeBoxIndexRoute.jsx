import wavyTech from '../assets/Wavy_Tech-07_Single-01.jpg';
import { useOutletContext } from 'react-router-dom';
import { CiMenuBurger } from 'react-icons/ci';
export default function IndexMessageBoxRoute() {
  const { toggleNav, handleClickNav } = useOutletContext();
  return (
    <section style={{ position: 'relative', width: '100%', bottom: 0 }}>
      <div className="chats-section__empty-chat">
        {toggleNav && <div onClick={handleClickNav} className="overlay"></div>}
        <>
          <CiMenuBurger
            style={{ top: '1rem', transform: 'translateY(0)' }}
            className="chats-section__icon-toggle"
            onClick={handleClickNav}
          />
          <img className="chats-section__empty-chat-img" src={wavyTech} />
          <p>Your chats Will appear here</p>
        </>
      </div>
      <footer
        style={{ zIndex: toggleNav ? -1 : 1 }}
        className="chats-section__footer"
      >
        <p>
          Created with love by{' '}
          <a rel="noreferrer" target="_blank" href="https://eloho.vercel.app">
            Eloho Kennedy
          </a>
        </p>
      </footer>
    </section>
  );
}
