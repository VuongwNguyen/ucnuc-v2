import React, { useState, useEffect } from "react";
import Portal from "./Portal";
import { Minus, Plus } from "lucide-react";
import Table from "../../dao/model/Table";
import { toast } from "react-toastify";

export default function TablePortal({ isOpen, onClose }) {
  const [showAddTable, setShowAddTable] = useState(false);
  const [tables, setTables] = useState([]);
  const [tableName, setTableName] = useState("");

  useEffect(() => {
    async function fetchData() {
      Table.read((tables) => {
        setTables(tables);
      });
    }
    fetchData();
  }, []);

  function createTable() {
    if (!tableName) return toast.error("Tên bàn không được để trống");
    const table = new Table(null, tableName);
    toast.promise(table.createTable(), {
      pending: "Đang thêm bàn...",
      success: "Thêm bàn thành công",
      error: "Thêm bàn thất bại",
    });
  }

  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-row justify-between">
        <h2>Quản lý bàn</h2>
        <button
          onClick={() => setShowAddTable(!showAddTable)}
          className={`${
            showAddTable ? "bg-red-500" : "bg-secondary"
          } text-white rounded-full p-2 active:bg-[#E2BFD9] h-full font-semibold`}
        >
          {!showAddTable ? (
            <Plus size={24} color="white" />
          ) : (
            <Minus size={24} color="white" />
          )}
        </button>
      </div>
      {showAddTable && (
        <div className={`container gap-3 flex-row flex justify-between mt-3`}>
          <input
            type="text"
            placeholder="Tên bàn"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 flex-1 
            focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
          />
          <button
            onClick={() => createTable()}
            className="bg-secondary text-white rounded-lg px-4 active:bg-white transition-transform"
          >
            Thêm
          </button>
        </div>
      )}
      <div className="container mt-3">
        <div className={`grid grid-cols-1 gap-4`}>
          {tables.map((table, index) => {
            return (
              <div
                className="bg-white p-4 rounded-lg shadow-md border-2 border-red-500"
                key={index}
              >
                <h3>{table.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </Portal>
  );
}
