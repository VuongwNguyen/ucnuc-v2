import React, { useEffect } from "react";
import { useSocketIOContext } from "../../context/SocketIOContext";
import useDayjs from "../../hooks/useDayjs";
import Masonry from "react-masonry-css";
import { updateOrderStatus } from "./../../api/Order.api";
import { toast } from "react-toastify";
import { priceFormatter } from "../../util/priceFormatter";
import { CheckCircle, XCircle } from "lucide-react";

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý đơn hàng</h1>
        <div className="text-sm text-gray-600">
          Còn lại {orders.length} đơn hàng
        </div>
      </div>

      <Masonry
        breakpointCols={{
          default: 5,
          1300: 4,
          1100: 3,
          700: 2,
        }}
        className="flex flex-wrap gap-4"
        columnClassName="flex flex-col items-center"
      >
        {orders.map((order) => (
            <div
              key={order.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-full"
            >
              {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                Đơn hàng #{order.id}
                </h2>
                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              {/* Thông tin đơn hàng */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Vị trí:</span>
                <span>{order.table_name}</span>
                </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Phương thức:</span>
                <span>{order.payment_method === "cash" ? "Tiền mặt" : "Chuyển khoản"}</span>
                </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Tổng tiền:</span>
                <span className="font-semibold text-primary">
                    {priceFormatter(order?.total).formattedPrice}
                  </span>
                </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Trạng thái:</span>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  {
                    pending: "bg-yellow-100 text-yellow-800",
                    processing: "bg-blue-100 text-blue-800",
                    completed: "bg-green-100 text-green-800",
                    cancelled: "bg-red-100 text-red-800",
                  }[order.status]
                }`}>
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
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Tham chiếu:</span>
                  <span>{order.ref_pay}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Thanh toán:</span>
                <span className={`px-2 py-1 text-sm rounded-full ${
                      order.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                }`}>
                  {order.payment_status === "pending" ? "Chưa thanh toán" : "Đã thanh toán"}
                  </span>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
            <div className="border-t pt-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Danh sách món
                </h3>
              <div className="space-y-3">
                  {order.orderDetails.map((detail, index) => (
                    <div
                      key={index}
                    className="bg-gray-50 rounded-lg p-3"
                    >
                    <p className="font-medium text-gray-800 mb-1">
                        {detail.product_name}
                      </p>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>Số lượng: {detail.quantity}</p>
                        <p>
                          Giá:{" "}
                        <span className="font-semibold text-primary">
                            {priceFormatter(detail.price).formattedPrice}
                          </span>
                        </p>
                      </div>

                      {/* Danh sách topping */}
                      {detail.toppingDetails.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <ul className="text-sm text-gray-600 space-y-1">
                            {detail.toppingDetails.map((topping) => (
                            <li key={topping.sku_topping} className="flex justify-between">
                              <span>{topping.name_topping} - {topping.quantity}</span>
                              <span className="font-semibold text-primary">
                                  {priceFormatter(topping.price).formattedPrice}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Nút xử lý */}
              <div className="flex gap-3 mt-4">
                    <button
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        confirm("Xác nhận tiếp nhận đơn hàng?") &&
                          processingOrder({
                            id: order.id,
                            status: "processing",
                          });
                      }}
                    >
                  <CheckCircle className="w-4 h-4" />
                      <span>Tiếp nhận</span>
                    </button>
                    <button
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => {
                        confirm("Xác nhận hủy đơn hàng?") &&
                          processingOrder({
                            id: order.id,
                            status: "cancelled",
                          });
                      }}
                    >
                  <XCircle className="w-4 h-4" />
                      <span>Hủy</span>
                    </button>
                  </div>
                </div>
              </div>
        ))}
      </Masonry>
    </div>
  );
}
