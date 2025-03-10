import { Bounce, ToastContainer } from "react-toastify";
import Navigator from "./navigations/Navigator";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Home from "./screen/Home";
import Error from "./screen/Error";
import Checkout from "./screen/Checkout";
import Login from "./screen/admin/Login";
import Dashboard from "./screen/admin/Dashboard";
import Order from "./screen/admin/Order";

import { useAuthAdminContext } from "./../context/AuthAdminContext";
import Table from "./../screen/admin/Table";
import Product from "../screen/admin/Product";
import Category from "../screen/admin/Category";

// Component Route chung cho cả protected và guest routes
const AuthRoute = ({ isAuth, isProtected = true, redirect }) => {
  const shouldRedirect = isProtected ? !isAuth : isAuth;
  return shouldRedirect ? <Navigate to={redirect} /> : <Outlet />;
};

function App() {
  const { admin, setAdmin } = useAuthAdminContext();

  useEffect(() => {
    // Chỉ chạy 1 lần khi mount để kiểm tra auth từ localStorage
    const checkAuth = () => {
      const account = localStorage.getItem("account");
      setAdmin(Boolean(account)); // Cập nhật trạng thái admin
    };
    if (admin === false) {
      // Chỉ kiểm tra nếu admin chưa được set
      checkAuth();
    }
  }, [setAdmin]); // Chỉ phụ thuộc vào setAdmin, không cần admin trong dependency

  // Trạng thái loading để tránh UI flicker
  if (admin === null || admin === undefined) {
    return <div>Loading...</div>; // Có thể thay bằng component Loading
  }
  return (
    <>
      {/* <Navigator /> */}
      <Router>
        <Routes>
          {/* Public Routes */}
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
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
    </>
    // <div className="App p-8">
    //   <h1 className="text-3xl font-bold text-center mb-8">
    //     Masonry Grid with Tailwind & Masonry-Layout
    //   </h1>
    //   <MasonryGrid />
    // </div>
  );
}

export default App;
