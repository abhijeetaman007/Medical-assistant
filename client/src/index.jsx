import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from "./context/AuthContext"
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from 'react-toast-notifications';
import Modal from 'react-modal';

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
