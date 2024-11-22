import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/UcnucContext.jsx";
import AuthProvider from "./context/AuthAdminContext.jsx";

createRoot(document.getElementById("root")).render(
    <CartProvider>
      <AuthProvider>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_REACT_APP_CLIENT_ID}
        >
          <App />
        </GoogleOAuthProvider>
      </AuthProvider>
    </CartProvider>
);
