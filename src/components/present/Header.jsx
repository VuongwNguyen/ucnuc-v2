import React from "react";
import Cookies from "js-cookie";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";

export default function Header() {
  return (
    <div className="container">
      <h5 className="font-bold truncate">
        Xin chào, {Cookies.get("username")}
      </h5>
      <div className="flex flex-1 flex-row justify-between items-center gap-3">
        <span className="font-bold truncate">
          Mã khách hàng: {Cookies.get("customer_id")}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(Cookies.get("customer_id"));
            toast.success("Đã copy mã khách hàng");
          }}
          className="flex items-center justify-center p-2 rounded-md bg-secondary"
        >
          <Copy size={20} />
        </button>
      </div>
    </div>
  );
}
