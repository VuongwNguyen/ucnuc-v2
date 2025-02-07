import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { SocketIOProvider } from "./../../context/SocketIOContext";

const Dashboard = () => {
  return (
    <SocketIOProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* <SideBar /> */}

        <div className="flex flex-col w-full">
          {/* Header */}
          <header className="p-4 bg-white shadow-md">
            <ul className="flex justify-between ">
              {nav.map((item, index) => (
                <li key={index}>
                  <Link
                    className={`no-underline border p-2 border-transparent text-white rounded-md hover:bg-gray-200 hover:text-black ${
                      item.name === "Logout" ? "bg-red-500" : "bg-gray-500"
                    }`}
                    to={item.link}
                    style={{ color: "#000" }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </header>
          {/* Main Content */}
          <main className="overflow-y-auto">
            <Outlet /> {/* Render nội dung của route con */}
          </main>
        </div>
      </div>
    </SocketIOProvider>
  );
};

export default Dashboard;

const nav = [
  {
    name: "Order",
    link: "/admin/order",
  },
  {
    name: "Table",
    link: "/admin/table",
  },
  {
    name: "Product",
    link: "/admin/product",
  },
  {
    name: "Category",
    link: "/admin/category",
  },
  {
    name: "User",
    link: "/admin/user",
  },
  {
    name: "Logout",
    link: "/login",
  },
];
