import { Album, CalendarDays, Coffee, Menu, Pizza } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import TablePortal from "../components/portal/TablePortal";
import ProductPortal from "./../components/portal/ProductPortal";
import CategoryPortal from "../components/portal/CategoryPortal";
export default function Admin() {
  const [show, setShow] = useState(false);
  const [tablePortalShow, setTablePortalShow] = useState(false);
  const [productPortShow, setProductPortShow] = useState(false);
  const [categoryPortShow, setCategoryPortShow] = useState(false);

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
      </div>
    </div>
  );
}
