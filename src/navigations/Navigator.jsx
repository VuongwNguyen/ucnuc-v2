import React, { useEffect, useState } from "react";
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
import Login from "../screen/admin/Login";
import Dashboard from "./../screen/admin/Dashboard";
import Order from "./../screen/admin/Order";

import Table from "./../screen/admin/Table";
import Product from "../screen/admin/Product";
import Category from "../screen/admin/Category";
import Statistics from "../screen/admin/Statistics";
import LandingPage from "../screen/";
import { useSelector } from "react-redux";
import Loading from "../components/present/Loading";
// Component Route chung cho cả protected và guest routes
const AuthRoute = ({ isAuth, isProtected = true, redirect }) => {
  const shouldRedirect = isProtected ? !isAuth : isAuth;
  return shouldRedirect ? <Navigate to={redirect} /> : <Outlet />;
};

export default function Navigator() {
  const { admin, loading } = useSelector((state) => state.account);
  if (loading) return <Loading message={`Đang tải ...`} />;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/:table_id" element={<Home />} />
        <Route path="/checkout/:order_id" element={<Checkout />} />
        <Route path="*" element={<Error />} />

        {/* Guest Routes */}
        <Route
          element={
            <AuthRoute isAuth={admin} isProtected={false} redirect="/admin" />
          }
        >
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <AuthRoute isAuth={admin} isProtected={true} redirect="/login" />
          }
        >
          <Route path="/admin" element={<Dashboard />}>
            <Route index element={<Navigate to="order" />} />
            <Route path="order" element={<Order />} />
            <Route path="table" element={<Table />} />
            <Route path="product" element={<Product />} />
            <Route path="category" element={<Category />} />
            <Route path="user" element={<div>User</div>} />
            <Route path="statistics" element={<Statistics />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
