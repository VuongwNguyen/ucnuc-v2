import React, { useEffect, useState } from "react";
import { getTables } from "../../api/TableArea.api";

export default function Table() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  useEffect(() => {
    getTables({}, (data) => {
      setTables(data.rows);
    });
  }, []);

  console.log(selectedTable);
  return (
    <div>
      <div className="flex justify-around items-center p-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
          Tạo bàn
        </button>
        <button
          onClick={() => {}}
          className="bg-lime-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          In QR Code
        </button>
        <button
          onClick={() => {
            // nếu selectedTable rỗng thì chọn tất cả, ngược lại thì xóa hết
            if (selectedTable.length === 0) {
              setSelectedTable(tables.map((table) => table.id));
            } else {
              setSelectedTable([]);
            }
          }}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          {selectedTable.length > 0 ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {tables?.map((table) => (
          <div
            onClick={() => {
              // nếu id đã tồn tại trong mảng thì xóa đi
              if (selectedTable.includes(table.id)) {
                setSelectedTable(selectedTable.filter((id) => id !== table.id));
              } else {
                setSelectedTable([...selectedTable, table.id]);
              }
            }} // Add this line
            key={table.id}
            className={`border-2 rounded-lg shadow-md p-4 flex flex-col items-center ${
              selectedTable.includes(table.id) && "bg-blue-100"
            } cursor-pointer`}
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {table.name}
            </h2>
            <p
              className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                table.status === "free"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {table.status === "free" ? "🟢 Trống" : "🔴 Đang sử dụng"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
