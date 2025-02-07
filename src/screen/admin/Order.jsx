import React, { useEffect } from "react";
import { useSocketIOContext } from "../../context/SocketIOContext";
import useDayjs from "../../hooks/useDayjs";
import Masonry from "react-masonry-css";
import { updateOrderStatus } from "./../../api/Order.api";
import { toast } from "react-toastify";
import { priceFormatter } from "../../util/priceFormatter";

export default function Order() {
  const { formatDate } = useDayjs();
  const { socket, orders } = useSocketIOContext();
  useEffect(() => {
    socket.emit("initOrder", {
      page: 1,
      limit: 1000,
    });

    return () => socket?.close;
  }, [socket]);

  async function processingOrder({ id, status }) {
    toast
      .promise(updateOrderStatus({ order_id: id, status }), {
        pending: "Đang xử lý...",
        success: "Cập nhật trạng thái thành công",
        error: "Có lỗi xảy ra",
      })
      .then(() => {
        socket.emit("initOrder", {
          page: 1,
          limit: 1000,
        });
      });
  }

  return (
    <div>
      <div>còn lại số đơn hàng {orders.length}</div>
      <Masonry
        breakpointCols={{
          default: 5, // Mặc định 4 cột cho desktop
          1300: 4, // 4
          1100: 3, // 3 cột cho màn hình từ 1100px (tablet)
          700: 2, // 2 cột cho màn hình từ 700px (mobile)
        }} // Cấu hình số cột
        className="flex flex-wrap" // Khoảng cách giữa các item
        columnClassName="flex flex-col items-center" // Lớp cho mỗi cột
      >
        {orders.map((order) => {
          return (
            <div
              key={order.id}
              className="border p-2 m-2 bg-white rounded-lg shadow-md"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-2 flex-col">
                <h2 className="text-lg font-semibold text-gray-800">
                  🛒 Đơn hàng #{order.id}
                </h2>
                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              {/* Thông tin đơn hàng */}
              <div className="flex flex-1 gap-2 text-gray-700 flex-col">
                <div>
                  <span className="font-semibold">📍 Vị trí:</span>{" "}
                  {order.table_name}
                </div>
                <div>
                  <span className="font-semibold">💰 Phương thức:</span>
                  {order.payment_method === "cash"
                    ? " Tiền mặt"
                    : " Chuyển khoản"}
                </div>
                <div>
                  <span className="font-semibold">💵 Tổng tiền:</span>
                  <span className="font-bold text-green-600">
                    {" "}
                    {priceFormatter(order?.total).formattedPrice}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">🚀 Trạng thái: </span>
                  <span className="uppercase font-semibold">
                    {
                      {
                        pending: "Chờ xử lý",
                        processing: "Đang xử lý",
                        completed: "Hoàn thành",
                        cancelled: "Đã hủy",
                      }[order.status]
                    }
                  </span>
                </div>
                {order.ref_pay && (
                  <p>
                    <span className="font-semibold">🔗 Tham chiếu:</span>{" "}
                    {order.ref_pay}
                  </p>
                )}
                <div>
                  <span className="font-semibold">💳 Thanh toán:</span>
                  <span
                    className={`ml-1 px-2 py-1 text-sm rounded ${
                      order.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.payment_status === "pending"
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                  </span>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="mt-3">
                <h3 className="text-xl font-semibold border-b pb-1">
                  🍽️ Danh sách món
                </h3>
                <div className="space-y-2 mt-2">
                  {order.orderDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="p-2 border rounded-md bg-gray-50"
                    >
                      <p className="font-semibold text-gray-800">
                        {detail.product_name}
                      </p>
                      <div className="text-sm text-gray-600">
                        <p>Số lượng: {detail.quantity}</p>
                        <p>
                          Giá:{" "}
                          <span className="text-green-600 font-bold">
                            {priceFormatter(detail.price).formattedPrice}
                          </span>
                        </p>
                      </div>

                      {/* Danh sách topping */}
                      {detail.toppingDetails.length > 0 && (
                        <div className="mt-1 border-t pt-1 text-sm text-gray-600">
                          <ul className="list-disc pl-5">
                            {detail.toppingDetails.map((topping) => (
                              <li key={topping.sku_topping}>
                                {topping.name_topping} - {topping.quantity} x
                                <span className="text-green-600 font-bold">
                                  {" "}
                                  {priceFormatter(topping.price).formattedPrice}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-around">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        confirm("Xác nhận tiếp nhận đơn hàng?") &&
                          processingOrder({
                            id: order.id,
                            status: "processing",
                          });
                      }}
                    >
                      <span>Tiếp nhận</span>
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        confirm("Xác nhận hủy đơn hàng?") &&
                          processingOrder({
                            id: order.id,
                            status: "cancelled",
                          });
                      }}
                    >
                      <span>Hủy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
