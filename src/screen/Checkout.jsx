import React, { useEffect, useState } from "react";
import { priceFormatter } from "../util/priceFormatter";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getOrdersByID, createPayment } from "../store/api";
import { cleanUp } from "../store/slices";
import Loading from "../components/present/Loading";
import {
  ArrowLeft,
  CreditCard,
  Coins,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Receipt,
  Wallet,
} from "lucide-react";

export default function Checkout() {
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.order);
  const navigate = useNavigate();
  const { order_id } = useParams();

  useEffect(() => {
    async function fetchOrder() {
      toast
        .promise(dispatch(getOrdersByID(order_id)).unwrap(), {
          pending: "Đang xử lý",
          success: "Lấy thông tin đơn hàng thành công",
          error: "Lấy thông tin đơn hàng thất bại",
        })
        .catch(() => navigate("/"));
    }

    fetchOrder();

    return () => dispatch(cleanUp());
  }, []);

  async function onCreatePayment() {
    toast.promise(
      dispatch(
        createPayment({
          order_id: order_id,
          amount: parseInt(order.total),
          items: order.orderDetails.map((item) => ({
            name: item.product_name,
            quantity: item.quantity,
            price:
              parseInt(item.price) +
              parseInt(
                item.toppingDetails.reduce(
                  (acc, topping) => acc + parseInt(topping.price),
                  0
                )
              ),
          })),
          origin: window.location.origin,
        })
      )
        .unwrap()
        .then((payment) => (window.location.href = payment.checkoutUrl)),
      {
        pending: "Đang xử lý",
        success: "Tạo thanh toán thành công",
        error: "Tạo thanh toán thất bại",
      }
    );
  }

  if (loading) return <Loading message={"Đang tải dữ liệu..."} />;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-primary" />
            <h1 className="text-base font-medium text-gray-900">
              Đơn hàng #{order?.id}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Order Status */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {order?.payment_method === "cash" ? (
                <Coins className="w-4 h-4 text-gray-500" />
              ) : (
                <CreditCard className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-600">
                Phương thức thanh toán
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {order?.payment_method === "cash" ? "Tiền mặt" : "Thẻ"}
            </span>
          </div>

          <div
            className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(
              order?.payment_status
            )}`}
          >
            <div className="flex items-center space-x-2">
              {order?.payment_status === "pending" ? (
                <Clock className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="text-sm">Trạng thái thanh toán</span>
            </div>
            <span className="text-sm font-medium">
              {order?.payment_status === "pending"
                ? "Chưa thanh toán"
                : "Đã thanh toán"}
            </span>
          </div>

          <div
            className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(
              order?.status
            )}`}
          >
            <div className="flex items-center space-x-2">
              {getStatusIcon(order?.status)}
              <span className="text-sm">Trạng thái đơn hàng</span>
            </div>
            <span className="text-sm font-medium">
              {
                {
                  pending: "Chờ xử lý",
                  processing: "Đang xử lý",
                  completed: "Hoàn thành",
                  cancelled: "Đã hủy",
                }[order?.status]
              }
            </span>
          </div>

          {order?.ref_pay && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Mã tham chiếu</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {order?.ref_pay}
              </span>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">
            Chi tiết sản phẩm
          </h2>
          <div className="space-y-3">
            {order?.orderDetails?.map((item, index) => {
              const toppingPrice = item.toppingDetails.reduce(
                (acc, topping) => acc + parseInt(topping.price),
                0
              );
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.product_name}
                    </h3>
                    {item.toppingDetails.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.toppingDetails
                          .map((topping) => topping.name_topping)
                          .join(", ")}
                        {toppingPrice > 0 && (
                          <span className="ml-1 text-primary">
                            +{priceFormatter(toppingPrice).formattedPrice}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-right">
                    <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                      {item.quantity}x
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {
                        priceFormatter(
                          item.price * item.quantity + toppingPrice
                        ).formattedPrice
                      }
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total and Payment Button */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Tổng cộng</span>
            <span className="text-base font-semibold text-primary">
              {priceFormatter(order?.total).formattedPrice}
            </span>
          </div>

          {order?.payment_status !== "completed" && (
            <button
              onClick={onCreatePayment}
              className="w-full bg-primary text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-200"
            >
              Thanh toán chuyển khoản
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
