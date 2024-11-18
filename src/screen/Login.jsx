import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Customer from "../dao/model/Customer";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const username = Cookies.get("username");
  const customer_id = Cookies.get("customer_id");
  const navigate = useNavigate();

  function handleSuccess(response) {
    if (username && customer_id) return navigate(0);

    const { credential } = response;
    const ggUser = jwtDecode(credential);
    const customer = new Customer(ggUser.name, ggUser.email);
    toast
      .promise(customer.authCustomer(), {
        loading: "Xác thực tài khoản, vui lòng đợi...",
        success: "Xác thực tài khoản thành công",
        error: "Thất bại khi xác thực tài khoản",
      })
      .then((docRef) => {
        Cookies.set("customer_id", docRef.customer_id, { expires: 30 });
        Cookies.set("username", docRef.username, { expires: 30 });
        console.log("navigate to choose-position");
        navigate(0);
      });
  }
  function handleFailure(response) {
    toast.error("Đăng nhập thất bại");
    console.log(response);
  }
  return (
    <div className="w-full h-screen justify-center flex flex-1 items-center">
      <div className="border-1 p-5 rounded-2xl mx-3">
        <div>
          <h1 className="text-3xl font-bold text-center">Chào bạn</h1>
          <p className="text-center">
            Để đảm bảo tính an toàn, vui lòng đăng nhập để tiếp tục
          </p>
        </div>
        <div className="m-3">
          <GoogleLogin onSuccess={handleSuccess} onFailure={handleFailure} />
        </div>
      </div>
    </div>
  );
}
