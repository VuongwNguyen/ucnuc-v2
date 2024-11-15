import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../screen/Home";
import Admin from "../screen/Admin";
import ChoosePosition from "../screen/ChoosePosition";
import Cookies from "js-cookie";
import Customer from "../dao/model/Customer";
import { toast } from "react-toastify";
import Login from "../components/portal/Login";

export default function Navigator() {
  const [showRegiter, setShowRegister] = useState(false);
  const customer_id = Cookies.get("customer_id");
  const username = Cookies.get("username");
  useEffect(() => {
    if (!customer_id || !username) {
      setShowRegister(true);
    } else {
      setShowRegister(false);
    }
  }, [showRegiter, customer_id, username]);

  return (
    <Router>
      <div>
        <Login isOpen={showRegiter} onClose={() => setShowRegister(false)} />
        <Routes>
          <Route
            path="/"
            element={
              !customer_id && !username ? (
                <Navigate to="/choose-position" />
              ) : (
                <Home />
              )
            }
          />
          <Route path="/choose-position" element={<ChoosePosition />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      Uc Nuc
      <h1>404 Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>Why you are seeing this page? please go back to the home page.</p>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Go to Home
      </button>
    </div>
  );
}
