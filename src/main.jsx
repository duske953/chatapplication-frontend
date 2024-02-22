import React from 'react';
import ReactDOM from 'react-dom/client';
import MessageBoxRoute from './routes/MessageBoxRoute.jsx';
import IndexMessageBoxRoute from './routes/MessabeBoxIndexRoute.jsx';
import './styles/main.scss';
import 'react-chat-elements/dist/main.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <IndexMessageBoxRoute />,
      },
      {
        path: '/chats/:profile',
        element: <MessageBoxRoute />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
