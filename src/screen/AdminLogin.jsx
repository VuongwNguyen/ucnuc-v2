import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthAdminContext";
import Admin from "../dao/model/Admin";

export default function AdminLogin({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { admin, setAdmin } = useAuth();

  function handleSuccess(response) {
    const { credential } = response;
    const ggUser = jwtDecode(credential);

    toast
      .promise(Admin.authAdmin(ggUser.email), {
        loading: "Đang xác thực thông tin...",
        success: "Đăng nhập thành công",
        error: "Đăng nhập thất bại",
      })
      .then((data) => {
        setAdmin(data);
        navigate("/admin");
      })
      .catch((err) => {
        console.log("err>>>>", err);
      });
  }
  function handleFailure(response) {
    toast.error("Đăng nhập thất bại");
    console.log(response);
  }
  return (
    <div className="w-full h-screen justify-center flex flex-1 items-center">
      <div className="border-1 p-5 rounded-2xl">
        <div>
          <h1 className="text-3xl font-bold text-center">System Management</h1>
          <p className="text-center">No entry without permission !!!</p>
        </div>
        <div className="m-3">
          <GoogleLogin onSuccess={handleSuccess} onFailure={handleFailure} />
        </div>
      </div>
    </div>
  );
}
