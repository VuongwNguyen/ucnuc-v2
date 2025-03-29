import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { SocketIOProvider } from "./../../context/SocketIOContext";
import {
  ShoppingBag,
  Grid,
  Package,
  FolderOpen,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart,
} from "lucide-react";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SocketIOProvider>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        {/* Overlay for mobile */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`
            fixed md:static top-0 left-0 h-screen bg-white shadow-lg z-50
            transition-[width,transform] duration-500 ease-in-out
            ${isMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
            ${!isSidebarHidden 
              ? "md:translate-x-0 md:w-64 md:opacity-100" 
              : "md:w-0 md:opacity-0 md:invisible"
            }
          `}
        >
          <div className={`
            flex flex-col h-full w-64
            transition-opacity duration-500 ease-in-out
            ${!isSidebarHidden ? "opacity-100" : "opacity-0"}
          `}>
            {/* Logo */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 object-scale-down"
                  src={"../images/logo.jpg"}
                  alt="logo"
                />
                <span className="text-xl font-semibold text-gray-800">
                  Úc Núc
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {nav.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.link
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  localStorage.removeItem("account");
                  window.location.reload();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`
          flex-1 flex flex-col min-h-screen
          transition-[margin] duration-500 ease-in-out
          ${!isSidebarHidden ? "md:ml-0" : ""}
        `}>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between px-4 h-16">
              <div className="flex items-center gap-2">
                <button
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-600" />
                  )}
                </button>
                <h1 className="text-lg font-semibold text-gray-800">
                  {nav.find((item) => item.link === location.pathname)?.name ||
                    "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="hidden md:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all duration-500 ease-in-out"
                  onClick={() => setIsSidebarHidden(!isSidebarHidden)}
                >
                  {isSidebarHidden ? (
                    <ChevronRight className="w-5 h-5 text-gray-600 transition-transform duration-500 ease-in-out" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-gray-600 transition-transform duration-500 ease-in-out" />
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">A</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SocketIOProvider>
  );
};

export default Dashboard;

const nav = [
  {
    name: "Đơn hàng",
    link: "/admin/order",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  { name: "Bàn ghế", link: "/admin/table", icon: <Grid className="w-5 h-5" /> },
  {
    name: "Sản phẩm",
    link: "/admin/product",
    icon: <Package className="w-5 h-5" />,
  },
  {
    name: "Danh mục",
    link: "/admin/category",
    icon: <FolderOpen className="w-5 h-5" />,
  },
  {
    name: "Thống kê",
    link: "/admin/statistics",
    icon: <BarChart className="w-5 h-5" />,
  },
];
