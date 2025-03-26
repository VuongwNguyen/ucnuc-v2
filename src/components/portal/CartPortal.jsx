import React, { useState } from "react";
import Portal from "./Portal";
import { useCart } from "../../context/UcnucContext";
import { MinusCircle, PlusCircle, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { priceFormatter } from "../../util/priceFormatter";
import { createOrder } from "../../api/Order.api";
import { useDispatch, useSelector } from "react-redux";
import { adjustQuantity, removeItem, clearCart } from "../../store/slices";

export default function CartPortal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.product);
  const table_name = Cookies.get("table_name");

  async function onOrder() {
    const order_details = cart.cartItems.map((item) => {
      return {
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        toppings: item.toppings.map((topping) => {
          return {
            name_topping: topping.name,
            sku_topping: topping.sku,
            price: topping.price,
            quantity: 1,
          };
        }),
      };
    });

    toast.promise(
      createOrder(
        {
          table_name,
          payment_method: "cash",
          order_type: "dine-in",
          total: cart.total,
          order_details,
        },
        (meta) => {
          if (meta) {
            console.log("meta", meta);
            dispatch(clearCart());
            navigate("/checkout/" + meta.id);
          }
        }
      ),
      {
        pending: "Đang xử lý",
        success: "Đặt hàng thành công",
        error: "Đặt hàng thất bại",
      }
    );
  }

  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      {cart.cartItems.length > 0 ? (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium text-gray-800">Giỏ hàng</h2>
              <span className="text-xs text-gray-500">({cart.cartItems.length} sản phẩm)</span>
            </div>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs text-red-500 hover:text-red-600 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.cartItems.map((item, index) => {
              const tempPriceTopping = item.toppings.reduce(
                (sum, topping) => parseInt(topping.price) + sum,
                0
              );
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 bg-white rounded-xl border border-gray-100"
                >
                  <img
                    src={item.avatar_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => {
                          dispatch(
                            adjustQuantity({
                              name: item.name,
                              delta: -item.quantity,
                              toppings: item.toppings,
                            })
                          );
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        className="text-gray-400 hover:text-primary transition-colors"
                        onClick={() => {
                          dispatch(
                            adjustQuantity({
                              name: item.name,
                              delta: -1,
                              toppings: item.toppings,
                            })
                          );
                        }}
                      >
                        <MinusCircle size={18} />
                      </button>
                      <span className="text-sm font-medium text-gray-700 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="text-gray-400 hover:text-primary transition-colors"
                        onClick={() =>
                          dispatch(
                            adjustQuantity({
                              name: item.name,
                              delta: 1,
                              toppings: item.toppings,
                            })
                          )
                        }
                      >
                        <PlusCircle size={18} />
                      </button>
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        {priceFormatter(item.price).formattedPrice} x {item.quantity}
                      </p>
                      {item.toppings.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {item.toppings.map((topping) => topping.name).join(", ")}
                          {" + "}
                          {priceFormatter(tempPriceTopping).formattedPrice}
                        </p>
                      )}
                      <p className="text-sm font-medium text-gray-900">
                        {priceFormatter(item.price * item.quantity + tempPriceTopping).formattedPrice}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Tổng cộng</span>
              <span className="text-lg font-semibold text-gray-900">
                {priceFormatter(cart.total).formattedPrice}
              </span>
            </div>
            <button
              onClick={() => onOrder()}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Thanh toán
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Giỏ hàng trống</h3>
          <p className="text-sm text-gray-500">
            Hãy thêm sản phẩm vào giỏ hàng để thanh toán
          </p>
        </div>
      )}
    </Portal>
  );
}
const paymentMethods = [
  {
    id: 0,
    name: "Tiền mặt",
    value: "cash",
  },
  {
    id: 1,
    name: "Chuyển khoản",
    value: "card",
  },
  // {
  //   id: 2,
  //   name: "Momo",
  //   value: "momo",
  // },
];
