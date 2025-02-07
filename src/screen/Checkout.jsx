import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { priceFormatter } from "../util/priceFormatter";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { getOrdersByID } from "../api/Order.api";

export default function Checkout() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const { order_id } = useParams();

  useEffect(() => {
    async function fetchOrder() {
      toast
        .promise(
          getOrdersByID(order_id, (orders) => {
            setOrder(orders);
          }),
          {
            pending: "Đang xử lý",
            success: "Lấy thông tin đơn hàng thành công",
            error: "Lấy thông tin đơn hàng thất bại",
          }
        )
        .catch(() => {
          navigate("/");
        });
    }

    fetchOrder();

    return () => {
      setOrder(null);
    };
  }, []);

  async function onCreatePayment() {}

  console.log(order);

  return (
    <div className="h-full">
      <div className="text-center p-3 text-lg font-medium bg-slate-300">
        Mã Hoá Đơn: {order?.id}
      </div>

      <div className=" gap-3 flex flex-1 flex-col p-4 overflow-auto h-full">
        <div className="rounded-lg bg-neutral-50 p-4 shadow-md border border-gray-200">
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">
              Phương thức thanh toán:{" "}
              <span className="text-blue-600">
                {order?.payment_method === "cash" ? "Tiền mặt" : "Thẻ"}
              </span>
            </label>
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">
              Thanh toán:{" "}
              <span className="text-blue-600">
                {order?.payment_status === "pending"
                  ? "Chưa thanh toán"
                  : "Đã thanh toán"}
              </span>
            </label>
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">
              Trạng thái:{" "}
              <span className="text-blue-600">
                {order?.status === "pending"
                  ? "Đang chờ xử lý"
                  : order?.status === "completed"
                  ? "Đã hoàn thành"
                  : order?.status === "canceled"
                  ? "Đã hủy"
                  : "Đang xử lý"}
              </span>
            </label>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Tham Chiếu:{" "}
              <span className="text-blue-600">{order?.ref_pay || ""}</span>
            </label>
          </div>
        </div>
        <div className="rounded-lg bg-neutral-50 p-4 shadow-md border border-gray-200">
          Danh sách sản phẩm:
          {order?.orderDetails?.map((item, index) => {
            const toppingPrice = item.toppingDetails.reduce(
              (acc, topping) => acc + parseInt(topping.price),
              0
            );
            return (
              <div
                key={index}
                className="flex flex-row justify-between items-center "
              >
                <div>
                  <span className="text-blue-600">{item.product_name}</span>
                  <p className="text-xs">
                    {item.toppingDetails
                      .map((topping) => topping.name_topping)
                      .join(", ")}{" "}
                    {toppingPrice > 0 &&
                      `+${priceFormatter(toppingPrice).formattedPrice}`}
                  </p>
                </div>

                <div className="flex flex-row">
                  <span>{priceFormatter(item.price).formattedPrice}</span>
                  <span className="ml-2">x</span>
                  <span className="ml-2">{item.quantity}</span>
                  <span className="ml-2">=</span>
                  <span className="ml-2">
                    {
                      priceFormatter(item.price * item.quantity + toppingPrice)
                        .formattedPrice
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-lg bg-neutral-50 p-4 shadow-md border border-gray-200">
          <div className="flex flex-row justify-between">
            <h3>Tổng cộng:</h3>
            <h3>{priceFormatter(order?.total).formattedPrice}</h3>
          </div>
        </div>
        {/* create payment button */}
        {order?.payment_status !== "completed" && (
          <div
            onClick={onCreatePayment}
            className="bg-secondary text-white p-2 rounded-lg mt-3 text-center cursor-pointer hover:bg-secondary-dark"
          >
            Thanh toán chuyển khoản
          </div>
        )}
      </div>
    </div>
  );
}
