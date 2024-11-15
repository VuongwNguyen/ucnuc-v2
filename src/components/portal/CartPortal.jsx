import React, { useState } from "react";
import Portal from "./Portal";
import { useCart } from "../../context/UcnucContext";
import Product from "../../dao/model/Product";
import { MinusCircle, PlusCircle } from "lucide-react";

export default function CartPortal({ isOpen, onClose }) {
  const { state, dispatch } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      {state.cartItems.length > 0 ? (
        <div className="flex flex-1 flex-col h-full justify-between p-1">
          <div className="flex flex-col flex-1">
            {state.cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-1 flex-row items-center justify-between p-2"
              >
                <div className="flex flex-1 flex-row gap-2">
                  <img src={item.image} alt={item.name} className="w-16 h-16" />
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {Product.priceFormatter(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
                {/* quantity */}
                <div className="flex flex-1 flex-row justify-around">
                  <button
                    className="text-red-500"
                    onClick={() =>
                      dispatch({
                        type: "ADJUST_QUANTITY",
                        payload: { id: item.id, delta: -1 },
                      })
                    }
                  >
                    <MinusCircle />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="text-red-500"
                    onClick={() =>
                      dispatch({
                        type: "ADJUST_QUANTITY",
                        payload: { id: item.id, delta: 1 },
                      })
                    }
                  >
                    <PlusCircle />
                  </button>
                </div>
                <div className="flex flex-col">
                  <button
                    className="text-red-500"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_ITEM",
                        payload: { id: item.id },
                      })
                    }
                  >
                    Xóa
                  </button>
                  <span>
                    {Product.priceFormatter(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* payment */}
          <select
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
            className="border border-gray-300 p-2 rounded-lg"
          >
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.value}>
                {method.name}
              </option>
            ))}
          </select>
          {/* total */}
          <div className="flex flex-row justify-between mt-3">
            <h3>Tổng cộng</h3>
            <h3>{Product.priceFormatter(state.total)}</h3>
          </div>
          <button className="bg-secondary text-white p-2 rounded-lg mt-3">
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
  {
    id: 2,
    name: "Momo",
    value: "momo",
  },
];
