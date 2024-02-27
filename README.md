## Anonymo: Your Anonymous Chat Playground

This repository contains the frontend code for a real-time chat application built with React, React Router, Socket.IO, Vite, and Sass. It offers features like typing indicator, anonymous messaging, and message history (within the browser session).

### Features

* **Typing indicator:** This feature visually indicates to other users when someone is actively typing a message, enhancing user experience and real-time engagement.
* **Anonymous messaging:** Users can participate in the chat without revealing their identity, promoting privacy and encouraging open communication.

* **Persistent messages**: Messages are stored and retrieved upon revisiting the chat, allowing users to keep track of the conversation history even after refreshing the browser. (Messages are lost as soon as the browser is closed making it really anonymous)
* **Chronological message order:** Messages are displayed in the order they are sent, ensuring a clear and consistent flow of conversation.
* **Message timestamps:** Each message displays the time it was sent, providing context and clarity for the conversation.
  
### Technologies Used

* **React:** ([https://react.dev/](https://react.dev/))
* **React Router:** ([https://reactrouter.com/en/main](https://reactrouter.com/en/main))
* **Socket.IO-client:** ([https://socket.io/docs/v4/client-api/](https://socket.io/docs/v4/client-api/))
* **Vite:** ([https://vitejs.dev/](https://vitejs.dev/))
* **Sass:** ([https://sass-lang.com/install/](https://sass-lang.com/install/))

### Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/duske953/chatapplication-frontend.git
   ```

2. **Install dependencies:**

   ```bash
   cd chatapplication-frontend
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   This will open the application in your default web browser.

**Important Note:**

* This frontend repository **requires a separate backend service to function**. You can find the compatible backend code at this repository: [https://github.com/duske953/chatAppBackend](https://github.com/duske953/chatAppBackend).
