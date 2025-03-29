import React, { useEffect } from "react";
import { useSocketIOContext } from "../../context/SocketIOContext";
import useDayjs from "../../hooks/useDayjs";
import Masonry from "react-masonry-css";
import { updateOrderStatus } from "./../../api/Order.api";
import { toast } from "react-toastify";
import { priceFormatter } from "../../util/priceFormatter";
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  ShoppingBag,
} from "lucide-react";

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

  // Tính toán thống kê
  const stats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    processing: orders.filter((order) => order.status === "processing").length,
    completed: orders.filter((order) => order.status === "completed").length,
    totalAmount: orders.reduce((sum, order) => sum + order.total, 0),
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-500 mt-1">
              Tổng số đơn hàng: {stats.total}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chờ xử lý</p>
                <p className="text-xl font-semibold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang xử lý</p>
                <p className="text-xl font-semibold text-gray-800">{stats.processing}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hoàn thành</p>
                <p className="text-xl font-semibold text-gray-800">{stats.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng doanh thu</p>
                <p className="text-xl font-semibold text-gray-800">
                  {priceFormatter(stats.totalAmount).formattedPrice}
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Orders List */}
      <Masonry
        breakpointCols={{
          default: 3,
          1400: 2,
          1100: 1,
        }}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {orders.map((order) => (
          <div
            key={order.id}
            className="w-full mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Đơn hàng #{order.id}
                </h2>
                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    {
                      pending: "bg-yellow-100 text-yellow-800",
                      processing: "bg-blue-100 text-blue-800",
                      completed: "bg-green-100 text-green-800",
                      cancelled: "bg-red-100 text-red-800",
                    }[order.status]
                  }`}
                >
                  {
                    {
                      pending: "Chờ xử lý",
                      processing: "Đang xử lý",
                      completed: "Hoàn thành",
                      cancelled: "Đã hủy",
                    }[order.status]
                  }
                </span>
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
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

            {/* Thông tin đơn hàng */}
            <div className="p-4 border-b border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <span className="font-medium whitespace-nowrap">
                  Vị trí: {order.table_name}
                </span>
                <span className="font-medium whitespace-nowrap">
                  Phương thức:{" "}
                  {order.payment_method === "cash"
                    ? "Tiền mặt"
                    : "Chuyển khoản"}
                </span>
                {order.ref_pay && (
                  <div className="flex items-center gap-2 text-gray-700 sm:col-span-2">
                    <span className="font-medium whitespace-nowrap">
                      Tham chiếu:
                    </span>
                    <span className="truncate">{order.ref_pay}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-700 sm:col-span-2">
                  <span className="font-medium whitespace-nowrap">
                    Tổng tiền:
                  </span>
                  <span className="font-semibold text-primary">
                    {priceFormatter(order?.total).formattedPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Danh sách món
              </h3>
              <div className="space-y-3">
                {order.orderDetails.map((detail, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <p className="font-medium text-gray-800 line-clamp-2">
                        {detail.product_name}
                      </p>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        x{detail.quantity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold text-primary">
                        {priceFormatter(detail.price).formattedPrice}
                      </p>
                    </div>

                    {/* Danh sách topping */}
                    {detail.toppingDetails.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <ul className="text-sm text-gray-600 space-y-1">
                          {detail.toppingDetails.map((topping) => (
                            <li
                              key={topping.sku_topping}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                            >
                              <span className="truncate">
                                {topping.name_topping} - {topping.quantity}
                              </span>
                              <span className="font-semibold text-primary whitespace-nowrap">
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
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
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
