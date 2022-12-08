import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './context/Socket';
import { PeerProvider } from './context/Peer';
import { VideoProvider } from './context/Video';
// import { CallPeersProvider } from './context/CallPeers';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <SocketProvider>
      <VideoProvider>
      <PeerProvider>
          <App />
      </PeerProvider>
      </VideoProvider>
    </SocketProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
