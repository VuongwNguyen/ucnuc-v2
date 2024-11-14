import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/UcnucContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <GoogleOAuthProvider clientId="361360418998-9cn0nap6liuk61vh9oqahvcq8g76f8lu.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </CartProvider>
  </StrictMode>
);
