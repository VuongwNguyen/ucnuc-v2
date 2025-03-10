import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { SocketIOProvider } from "./../../context/SocketIOContext";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <SocketIOProvider>
      <div className="flex min-h-screen">
        {/* <SideBar /> */}
        <div className="flex flex-col w-full">
          {/* Header */}
          <header className="p-4 bg-white shadow-md">
            <nav className="flex items-center justify-between max-w-6xl mx-auto">
              {/* Logo or Brand (optional) */}
              <div className="text-lg font-bold">Dashboard</div>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-4">
                {nav.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className={`px-3 py-2 rounded-md text-white no-underline
                      ${
                        item.name === "Logout"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      } transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Hamburger Menu Button */}
              <button
                className="md:hidden p-2 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden mt-4">
                {nav.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className={`block px-3 py-2 rounded-md text-white no-underline mb-2
                      ${
                        item.name === "Logout"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      } transition-colors duration-200`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SocketIOProvider>
  );
};

export default Dashboard;

const nav = [
  { name: "Order", link: "/admin/order" },
  { name: "Table", link: "/admin/table" },
  { name: "Product", link: "/admin/product" },
  { name: "Category", link: "/admin/category" },
  { name: "User", link: "/admin/user" },
  { name: "Logout", link: "/login" },
];