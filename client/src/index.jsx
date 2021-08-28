import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from "./context/AuthContext"
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from 'react-toast-notifications';
import { initializeApp } from "firebase/app";
import Modal from 'react-modal';

const firebaseConfig = {
    apiKey: "AIzaSyCaDLFdcpGlTc3dh-LGXNoZOCqBhJiH5ps",
    authDomain: "iron-verbena-296309.firebaseapp.com",
    databaseURL: "https://iron-verbena-296309-default-rtdb.firebaseio.com",
    projectId: "iron-verbena-296309",
    storageBucket: "iron-verbena-296309.appspot.com",
    messagingSenderId: "405135783077",
    appId: "1:405135783077:web:34aea0b2067a5c5fd6494c"
};

initializeApp(firebaseConfig);
Modal.setAppElement('#root')

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider autoDismiss autoDismissTimeout={2500}>
            <App />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
