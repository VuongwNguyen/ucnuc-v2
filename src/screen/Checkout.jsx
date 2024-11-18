import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Order from "../dao/model/Order";
import Product from "../dao/model/Product";
import { useLocation } from "react-router-dom";

export default function Checkout() {
  const order_id = Cookies.get("order_id");
  const [order, setOrder] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const refPay = queryParams.get("id");
  const cancel = queryParams.get("cancel");
  const status = queryParams.get("status");

  useEffect(() => {
    if (status === "PAID") {
      async function changePayStatus() {
        Order.changePayStatus(order_id, refPay);
      }
      changePayStatus();
    }
  }, [status]);

  useEffect(() => {
    const unsubscribe = Order.listenToOrder(order_id, (order) => {
      setOrder(order);
    });

    return () => unsubscribe();
  }, []);

  console.log(order);

  return (
    <div>
      <div className="text-center p-3 text-lg font-medium">
        Thông Tin đơn hàng
      </div>

      <div className="bg-slate-100 gap-3 flex flex-1 flex-col p-4 overflow-auto">
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-200">
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold truncate">
              Mã đơn: <span className="text-blue-600">{order?.id}</span>
            </label>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-semibold truncate">
              Tên Khách hàng:{" "}
              <span className="text-blue-600">
                {order?.customer_name} ({order?.customer_id})
              </span>
            </label>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-semibold truncate">
              Bàn:{" "}
              <span className="text-blue-600">
                {order?.table_name} ({order?.table_id})
              </span>
            </label>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-200">
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">
              Phương thức thanh toán:{" "}
              <span className="text-blue-600">
                {order?.methodPay === "cash" ? "Tiền mặt" : "Thẻ"}
              </span>
            </label>
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">
              Thanh toán:{" "}
              <span className="text-blue-600">
                {order?.payStatus === "unpaid"
                  ? "Chưa thanh toán"
                  : "Đã thanh toán"}
              </span>
            </label>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Trạng thái:{" "}
              <span className="text-blue-600">
                {order?.status === "pending"
                  ? "Đang chờ xử lý"
                  : order?.status === "completed"
                  ? "Đã hoàn thành"
                  : "Đã hủy"}
              </span>
            </label>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-200">
          Danh sách sản phẩm:
          {order?.orders.map((item) => (
            <div key={item.id} className="flex flex-row justify-between">
              <span>{item.name}</span>
              <div className="flex flex-row">
                <span>{item.price}</span>
                <span className="ml-2">x</span>
                <span className="ml-2">{item.quantity}</span>
                <span className="ml-2">=</span>
                <span className="ml-2">
                  {Product.formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-200">
          <div className="flex flex-row justify-between">
            <h3>Tổng cộng</h3>
            <h3>{Product.formatCurrency(order?.total)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
