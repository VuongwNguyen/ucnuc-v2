import React, { useEffect, useState } from "react";
import { getTables, createQRCode } from "../../api/TableArea.api";
import { toast } from "react-toastify";
import CreateNewTable from "../../components/portal/CreateNewTable";
import CreateNewArea from "../../components/portal/CreateNewArea";
import { CheckSquare, Square, Plus, Map, QrCode, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Quản lý bàn</h1>
          <p className="text-gray-500 mt-1">Tổng số bàn: {tables.length}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setShowModalTable(true)}
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo bàn mới</span>
        </button>
        <button
          onClick={() => setShowModalArea(true)}
          className="flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <Map className="w-5 h-5" />
          <span>Quản lý khu vực</span>
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
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <QrCode className="w-5 h-5" />
          <span>In QR Code</span>
        </button>
        <button
          onClick={() => {
            setSelectedTable(
              selectedTable.length === 0 ? tables.map((table) => table.id) : []
            );
          }}
          className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          {selectedTable.length > 0 ? (
            <>
              <XCircle className="w-5 h-5" />
              <span>Bỏ chọn tất cả</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Chọn tất cả</span>
            </>
          )}
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tables?.map((table) => (
          <div
            key={table.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md relative ${
              selectedTable.includes(table.id) ? 'ring-2 ring-primary' : ''
            }`}
          >
            {/* Selection Checkbox */}
            <button
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => {
                setSelectedTable(
                  selectedTable.includes(table.id)
                    ? selectedTable.filter((id) => id !== table.id)
                    : [...selectedTable, table.id]
                );
              }}
            >
              {selectedTable.includes(table.id) ? (
                <CheckSquare className="w-5 h-5 text-primary" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Table Info */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {table.name}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  table.status === "free"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {table.status === "free" ? "Trống" : "Đang sử dụng"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CreateNewArea
        isOpen={showModalArea}
        onClose={() => setShowModalArea(false)}
      />
      <CreateNewTable
        isOpen={showModalTable}
        onClose={() => setShowModalTable(false)}
      />
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
