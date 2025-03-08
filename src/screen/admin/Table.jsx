import React, { useEffect, useState } from "react";
import { getTables, createQRCode } from "../../api/TableArea.api";
import { toast } from "react-toastify";

export default function Table() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [qrCodes, setQRCodes] = useState([]);
  useEffect(() => {
    getTables({}, (data) => {
      setTables(data.list);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-around items-center p-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Tạo bàn
        </button>
        <button
          onClick={() => {
            if (selectedTable.length === 0) {
              toast.error("Vui lòng chọn bàn trước khi in QR Code");
              return;
            }
            createQRCode(
              {
                origin: window.location.origin,
                ids: selectedTable,
              },
              (data) => {
                console.log(data);
                setSelectedTable([]);
                setQRCodes(data);
                // in QR Code
              }
            );
          }}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
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
      {/* {
        // Add this line
        qrCodes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
            {qrCodes.map((qrCode) => {
              console.log(qrCode.qrCode);
              return (
                <div
                  key={qrCode.id}
                  className="border-2 rounded-lg shadow-md p-4 flex flex-col items-center"
                >
                  <img src={qrCode.qrCode} alt={qrCode.id} />
                  <p
                    className="mt-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    onClick={() => {
                      setQRCodes(qrCodes.filter((code) => code.id !== qrCode.id));
                      // Xóa QR Code
                    }}
                  >
                    Xóa
                  </p>
                </div>
              );
            })}
          </div>
        )
      } */}
    </div>
  );
}
