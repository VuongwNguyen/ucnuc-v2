import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChoosePosition from "./../screen/ChoosePosition";
import AdminLogin from "../screen/AdminLogin";
import Home from "./../screen/Home";
import Admin from "./../screen/Admin";
import Login from "../screen/Login";
import Error from "./../screen/Error";
import { useAuth } from "../context/AuthAdminContext";
import Cookies from "js-cookie";
import Checkout from "../screen/Checkout";

export default function Navigator() {
  const { admin } = useAuth();
  const customer = {
    customer_id: Cookies.get("customer_id"),
    username: Cookies.get("username"),
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/choose-position"
          element={<CustomerRoute isAuthenticated={customer} />}
        />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/admin"
          element={<PrivateRoute isAuthenticated={admin} />}
        />
      </Routes>
    </Router>
  );
}

const PrivateRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) return <AdminLogin />; // Chuyển hướng về trang đăng nhập nếu chưa xác thực
  return <Admin />; // Hiển thị thành phần Admin khi đã xác thực
};

const CustomerRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated?.customer_id || !isAuthenticated?.username)
    return <Login />; // Chuyển hướng về trang đăng nhập nếu chưa xác thực
  return <ChoosePosition />; // Hiển thị thành phần ChoosePosition khi đã xác thực
};
