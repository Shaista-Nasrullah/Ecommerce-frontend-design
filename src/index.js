import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import AppContextProvider from "./context/AppContext.jsx";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppContextProvider>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId="834569247629-1cg7r3niso1f4e9n18jjhpmtv7ch39kj.apps.googleusercontent.com">
            <App />
          </GoogleOAuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </PersistGate>
      </AppContextProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
