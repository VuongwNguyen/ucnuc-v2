import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Home from "./../screen/Home";
import Error from "./../screen/Error";
import Checkout from "../screen/Checkout";
import Login from "../screen/admin/login";
import Dashboard from "./../screen/admin/Dashboard";
import Order from "./../screen/admin/Order";

import { useAuthAdminContext } from "./../context/AuthAdminContext";
import Table from './../screen/admin/Table';

const ProtectedRoutes = ({ isAuth, redirect = "/login" }) => {
  return isAuth ? <Outlet /> : <Navigate to={redirect} />;
};

const GuestRoutes = ({ isAuth, redirect = "/admin" }) => {
  return isAuth ? <Navigate to={redirect} /> : <Outlet />;
};
export default function Navigator() {
  const { admin, setAdmin } = useAuthAdminContext();

  useEffect(() => {
    const isAuth = Boolean(localStorage.getItem("account"));
    setAdmin(isAuth);
  }, [admin]);

  return (
    <Router>
      <Routes>
        <Route path="/:table_id" element={<Home />} />
        <Route path="*" element={<Error />} />
        <Route path="/checkout/:order_id" element={<Checkout />} />

        <Route element={<GuestRoutes isAuth={admin} />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoutes isAuth={admin} />}>
          <Route path="/admin" element={<Dashboard />}>
            <Route index element={<Navigate to="order" />} />
            <Route path="order" element={<Order />} />
            <Route path="table" element={<Table/>} />
            <Route path="product" element={<div>Product</div>} />
            <Route path="category" element={<div>Category</div>} />
            <Route path="user" element={<div>User</div>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
