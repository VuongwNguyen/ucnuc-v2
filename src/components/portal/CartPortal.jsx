import React, { useState } from "react";
import Portal from "./Portal";
import { useCart } from "../../context/UcnucContext";
import { MinusCircle, PlusCircle } from "lucide-react";
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
  // const username = Cookies.get("username");
  // const customer_id = Cookies.get("customer_id");
  // const table_id = Cookies.get("table_id");
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
        <div className="flex flex-1 flex-col h-full justify-between p-1">
          <p className="text-xs">
            Ghi chú: Đưa số lượng về 0 để loại bỏ sản phẩm
          </p>

          <div className="flex flex-col flex-1">
            {cart.cartItems.map((item, index) => {
              const tempPriceTopping = item.toppings.reduce(
                (sum, topping) => parseInt(topping.price) + sum,
                0
              );
              return (
                <div
                  key={index}
                  className="flex flex-1 flex-row items-center justify-between p-2"
                >
                  <div className="flex flex-1 flex-row gap-2">
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      className="w-16 h-16"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="text-xs text-gray-500">
                        {priceFormatter(item.price).formattedPrice} x{" "}
                        {item.quantity}
                      </p>
                      {item.toppings.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {item.toppings
                            .map((topping) => topping.name)
                            .join(", ")}
                          {" + "}
                          {priceFormatter(tempPriceTopping).formattedPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* quantity */}
                  <div className="flex flex-1 flex-row justify-around">
                    <button
                      className="text-red-500"
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
                      <MinusCircle />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="text-red-500"
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
                      <PlusCircle />
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {
                        priceFormatter(
                          item.price * item.quantity + tempPriceTopping
                        ).formattedPrice
                      }
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* payment */}
          {/* <div className="flex flex-col gap-2">
            <h3>Phương thức thanh toán</h3>
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex flex-row items-center">
                <input
                  type="radio"
                  id={method.value}
                  name="payment"
                  value={method.value}
                />
                <label htmlFor={method.value}>{method.name}</label>
              </div>
            ))}
          </div> */}

          {/* total */}
          <div className="flex flex-row justify-between mt-3">
            <h3>Tổng cộng</h3>
            <h3>{priceFormatter(cart.total).formattedPrice}</h3>
          </div>
          <button
            onClick={() => onOrder()}
            className="bg-secondary text-white p-2 rounded-lg mt-3"
          >
            Thanh toán
          </button>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <span>Không có sản phẩm nào trong giỏ hàng</span>
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
