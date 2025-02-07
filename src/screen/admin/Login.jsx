import React from "react";
import { login } from "../../api/Account.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthAdminContext } from "../../context/AuthAdminContext";

export default function Login() {
  const { setAdmin } = useAuthAdminContext();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    toast.promise(
      login({ email, password, admin: true }, (res) => {
        setAdmin(Boolean(localStorage.getItem("account")));
      }),
      {
        loading: "Đang đăng nhập",
        success: "Đăng nhập thành công",
        error: "Đăng nhập thất bại",
      }
    );
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-center text-5xl font-bold">Úc Núc</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            className="p-2 m-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            className="p-2 m-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="p-2 m-2 bg-blue-500 text-white rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
