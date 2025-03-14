import React, { useState } from "react";
import Portal from "./Portal";

export default function CreateNewTable({ isOpen, onClose, table }) {
  const [name, setName] = useState(table ? table.name : "");
  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          {table ? "Chỉnh sửa bàn" : "Tạo bàn"}
        </h2>
        <p className="text-sm text-gray-500">Vui lòng nhập thông tin bàn</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Tên bàn
        </label>
        <input
          value={{}}
          onChange={(e) => {}}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </Portal>
  );
}
