import { Album, Coffee, Menu, Pizza } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TablePortal from "../components/portal/TablePortal";
import ProductPortal from "./../components/portal/ProductPortal";
import CategoryPortal from "../components/portal/CategoryPortal";
import Order from "../dao/model/Order";
import Product from "../dao/model/Product";
export default function Admin() {
  const [show, setShow] = useState(true);
  const [tablePortalShow, setTablePortalShow] = useState(false);
  const [productPortShow, setProductPortShow] = useState(false);
  const [categoryPortShow, setCategoryPortShow] = useState(false);
  const [orders, setOrders] = useState([]);
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

  useEffect(() => {
    Order.read((orders) => {
      setOrders(orders);
    });
  }, []);

  console.log(orders);

  async function onChangeStatus(order, status) {
    if (status === "completed") {
      const cf = confirm("Bạn có chắc chắn muốn hoàn thành đơn hàng?");
      if (!cf) {
        return;
      }
    } else if (status === "canceled") {
      const cf = confirm("Bạn có chắc chắn muốn hủy đơn hàng?");
      if (!cf) {
        return;
      }
    }

    toast
      .promise(Order.changeStatus(order.id, status), {
        pending: "Đang cập nhật trạng thái...",
        success: "Cập nhật trạng thái thành công",
        error: "Cập nhật trạng thái thất bại",
      })
      .then(() => {
        Order.read((orders) => {
          setOrders(orders);
        });
      });
  }

  async function onChangePayStatus(order) {
    const cf = confirm("Bạn có chắc chắn muốn thay đổi trạng thái thanh toán?");
    if (!cf) {
      return;
    }
    toast.promise(Order.changePayStatus(order.id), {
      pending: "Đang cập nhật trạng thái thanh toán...",
      success: "Cập nhật trạng thái thanh toán thành công",
      error: "Cập nhật trạng thái thanh toán thất bại",
    });
  }

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
          <div className="flex flex-1 flex-col gap-3">
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
                <div className="flex flex-1 flex-row justify-between">
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
                    <div className="flex flex-row items-center gap-1">
                      <input
                        type="checkbox"
                        id="checkbox"
                        className="checked:bg-green-600"
                        checked={order.payStatus === "paid"}
                        onChange={() => {}}
                      />
                      <label
                        for="checkbox"
                        className={`text-sm font-medium ${
                          order.payStatus === "unpaid"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.payStatus === "unpaid"
                          ? "Chưa thanh toán"
                          : "Đã thanh toán"}
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <input
                      type="radio"
                      id="radio"
                      checked={order.status === "processing"}
                      onChange={() => onChangeStatus(order, "processing")}
                    />
                    <label>Tiếp nhận</label>
                  </div>
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

                <div className="flex flex-1 flex-row justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Tổng tiền:
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {Product.formatCurrency(order.total)}
                    </span>
                  </div>
                  <div className="flex-row gap-2 flex">
                    <button
                      className="bg-green-500 text-white p-2 rounded-md"
                      onClick={() => onChangeStatus(order, "completed")}
                    >
                      Hoàn thành
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-md"
                      onClick={() => onChangeStatus(order, "canceled")}
                    >
                      Hủy
                    </button>
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
