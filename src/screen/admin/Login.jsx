import React from "react";
// import { login } from "../../api/Account.api";
import { toast } from "react-toastify";
import { useAuthAdminContext } from "../../context/AuthAdminContext";
import { Lock, Mail, Coffee, Utensils } from "lucide-react";
import { login } from "./../../store/api/AccountAPI";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();
  const { setAdmin } = useAuthAdminContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    toast.promise(dispatch(login({ email, password, admin: true })), {
      loading: "Đang đăng nhập",
      success: "Đăng nhập thành công",
      error: "Đăng nhập thất bại",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative">
              <img
                className="h-24 w-24 object-contain relative transform hover:scale-110 transition-transform duration-300"
                src="../images/logo.jpg"
                alt="Úc Núc"
              />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Đăng nhập Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vui lòng đăng nhập để tiếp tục
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 rounded-lg bg-blue-50 group-focus-within:bg-blue-100 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                className="block w-full pl-16 pr-4 py-3 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-base"
                placeholder="Email"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 rounded-lg bg-blue-50 group-focus-within:bg-blue-100 transition-colors duration-200">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                className="block w-full pl-16 pr-4 py-3 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-base"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-lg"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Coffee className="h-5 w-5 text-white" />
            </span>
            Đăng nhập
          </button>
        </form>

        <div className="flex justify-center items-center gap-4 text-gray-500">
          <Utensils className="w-5 h-5" />
          <span className="text-sm font-medium">Úc Núc - Quản lý nhà hàng</span>
          <Utensils className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
