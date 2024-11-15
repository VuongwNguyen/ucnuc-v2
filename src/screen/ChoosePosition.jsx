import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Table from "../dao/model/Table";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../components/present/Header";

export default function ChoosePosition() {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      await Table.read((tables) => {
        setTables(tables);
      });
    }
    fetchData();
    tables.forEach((table) => {
      if (table.customer_id === Cookies.get("customer_id")) {
        navigate("/");
        toast.success("chúng tôi phát hiện bạn vẫn còn ở trong bàn cũ");
      }
    });
  }, [tables, navigate]);

  async function onChooseTable(table) {
    if (table.customer_id && table.customer_id !== Cookies.get("customer_id")) {
      return toast.error("Bàn đã có người chọn");
    }
    console.log(table);
    toast
      .promise(Table.joinTable(table.id, Cookies.get("customer_id")), {
        loading: "Đang xử lý",
        success: "Chọn bàn thành công",
        error: "Đã xảy ra lỗi",
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* header */}
      <Header />
      <div className="marquee container">
        <span className="uppercase">
          Hãy lựa chọn cho mình một vị trí thật xinh nhé !!!
        </span>
      </div>

      <div className="container flex flex-1 flex-col">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onChooseTable(table)}
            disabled={
              table.customer_id &&
              table.customer_id !== Cookies.get("customer_id")
            }
            style={{
              backgroundImage: `${
                table.customer_id &&
                `linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://i.pinimg.com/474x/2d/e2/97/2de29737a820302935b7885baa902f2a.jpg')`
              }`,
            }}
            className={`border border-gray-300 p-2 m-2 rounded-md justify-center items-center flex flex-col ${
              table.customer_id ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <span
              className={`${table.customer_id ? "text-white" : "text-black"}`}
            >
              {table.name}
            </span>
            <span>
              {table.customer_id ? (
                <span
                  className={`${
                    table.customer_id ? "text-white" : "text-red-500"
                  }`}
                >
                  Đã có người chọn
                </span>
              ) : (
                <span className="text-green-500">Có thể chọn</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
