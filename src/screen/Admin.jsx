import { Album, Coffee, Menu, Pizza } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TablePortal from "../components/portal/TablePortal";
import ProductPortal from "./../components/portal/ProductPortal";
import CategoryPortal from "../components/portal/CategoryPortal";
import Order from "../dao/model/Order";
export default function Admin() {
  const [show, setShow] = useState(true);
  const [tablePortalShow, setTablePortalShow] = useState(false);
  const [productPortShow, setProductPortShow] = useState(false);
  const [categoryPortShow, setCategoryPortShow] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Order.read((orders) => {
      setOrders(orders);
    });
  }, []);

  console.log(orders);

  const nav = [
    {
      name: "Bàn ghế",
      onclick: () => {
        setTablePortalShow(true);
      },
      icon: <Coffee size="24" color="white" />,
    },
    {
      name: "Chủng Loại",
      onclick: () => {
        setCategoryPortShow(true);
      },
      icon: <Album size="24" color="white" />,
    },
    {
      name: "Sản Phẩm",
      onclick: () => {
        setProductPortShow(true);
      },
      icon: <Pizza size="24" color="white" />,
    },
  ];
  return (
    <div className="gap-2 flex flex-1 flex-col p-2">
      <TablePortal isOpen={tablePortalShow} onClose={setTablePortalShow} />
      <ProductPortal isOpen={productPortShow} onClose={setProductPortShow} />
      <CategoryPortal isOpen={categoryPortShow} onClose={setCategoryPortShow} />
      <div className="flex flex-1 justify-between items-center container">
        <h1>Admin</h1>
        <button
          className="p-2 rounded-md bg-secondary text-white"
          onClick={() => {
            setShow(!show);
          }}
        >
          <Menu size="24" />
        </button>
      </div>
      <div className="container">
        <div className={`grid grid-cols-3 gap-4 ${show && "hidden"}`}>
          {nav.map((item, index) => (
            <button
              key={index}
              className="bg-secondary flex flex-1 flex-col items-center rounded-full p-2"
              onClick={item.onclick}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        {orders.length > 0 ? (
          <div className="flex flex-1 flex-col gap-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
              >
                <div className="flex flex-col">
                  <span className="text-xl font-semibold truncate text-blue-600">
                    {order.customer_name} ({order.customer_id})
                  </span>
                  <span className="text-md text-gray-600 truncate">
                    {order.table_name} ({order.table_id})
                  </span>
                </div>

                <div className="flex flex-row gap-4">
                  <span
                    className={`text-sm font-medium ${
                      order.methodPay === "cash"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {order.methodPay === "cash" ? "Tiền mặt" : "Thẻ"}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      order.payStatus === "unpaid"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {order.payStatus === "unpaid"
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h1 className="text-lg font-bold text-gray-800 mb-3">
                    Danh sách sản phẩm:
                  </h1>
                  <div className="space-y-2">
                    {order.orders.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-row justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex flex-row items-center space-x-2">
                          <span className="text-sm text-gray-700">
                            {item.price}
                          </span>
                          <span className="text-sm">x</span>
                          <span className="text-sm text-gray-700">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-2 rounded-md shadow-md">
            <h1>Không có đơn hàng nào</h1>
          </div>
        )}
      </div>
    </div>
  );
}
