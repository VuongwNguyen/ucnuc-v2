import React, { useEffect, useState } from "react";
import { getTables, createQRCode } from "../../api/TableArea.api";
import { toast } from "react-toastify";
import CreateNewTable from "../../components/portal/CreateNewTable";
import CreateNewArea from "../../components/portal/CreateNewArea";
import { CheckSquare, Square } from "lucide-react";
export default function Table() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [showModalTable, setShowModalTable] = useState(false);
  const [showModalArea, setShowModalArea] = useState(false);
  const [qrCodes, setQRCodes] = useState([]);
  useEffect(() => {
    getTables({}, (data) => {
      setTables(data.list);
    });
  }, []);

  return (
    <div>
      <CreateNewArea
        isOpen={showModalArea}
        onClose={() => setShowModalArea(false)}
      />
      <CreateNewTable
        isOpen={showModalTable}
        onClose={() => setShowModalTable(false)}
      />
      <div className="flex flex-col justify-around gap-2 md:flex-row">
        <div
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md text-center hover:bg-blue-600 cursor-pointer"
          onClick={() => setShowModalTable(true)}
        >
          Tạo bàn
        </div>
        <div
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md text-center hover:bg-yellow-600 cursor-pointer"
          onClick={() => setShowModalArea(true)}
        >
          Quản lí khu vực
        </div>
        <div
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
          className="bg-lime-500 text-white px-4 py-2 rounded-lg shadow-md text-center hover:bg-lime-600 cursor-pointer"
        >
          In QR Code
        </div>
        <div
          onClick={() => {
            // nếu selectedTable rỗng thì chọn tất cả, ngược lại thì xóa hết
            setSelectedTable(
              selectedTable.length === 0 ? tables.map((table) => table.id) : []
            );
          }}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md text-center hover:bg-cyan-600 cursor-pointer"
        >
          {selectedTable.length > 0 ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
        {tables?.map((table) => (
          <div
            key={table.id}
            className={`border-2 rounded-lg shadow-md p-4 flex flex-col items-center relative`}
          >
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => {
                setSelectedTable(
                  selectedTable.includes(table.id)
                    ? selectedTable.filter((id) => id !== table.id)
                    : [...selectedTable, table.id]
                );
              }}
            >
              {selectedTable.includes(table.id) ? <CheckSquare /> : <Square />}
            </div>

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

{
  /* {
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
      } */
}
