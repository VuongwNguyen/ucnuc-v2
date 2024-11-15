import { GoogleLogin } from "@react-oauth/google";
import Portal from "./Portal";
import React from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Customer from "../../dao/model/Customer";
import { jwtDecode } from "jwt-decode";

export default function Login({ isOpen, onClose }) {
  function handleSuccess(response) {
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
        onClose();
      });
  }
  function handleFailure(response) {
    toast.error("Đăng nhập thất bại");
    console.log(response);
  }
  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-full justify-center flex flex-1 items-center">
        <div className="border-1 p-5 rounded-2xl">
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
    </Portal>
  );
}
