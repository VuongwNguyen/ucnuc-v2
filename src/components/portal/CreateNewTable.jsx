import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { useDispatch, useSelector } from "react-redux";
import { createTable, updateTable } from "../../store/api";
import { toast } from "react-toastify";

export default function CreateNewTable({ isOpen, onClose, table }) {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { areas } = useSelector((state) => state.tableArea);
  const [areasData, setNamesData] = useState([]);
  const [selectedArea, setSelectedArea] = useState(0);

  function handleSubmit() {
    if (table) {
      if (name === "") return toast.error("Vui lòng nhập tên bàn");
      if (selectedArea === 0) return toast.error("Vui lòng chọn khu vực");
      toast
        .promise(
          dispatch(updateTable({ id: table.id, name, area_id: selectedArea })),
          {
            pending: "Đang cập nhật bàn",
            success: "Cập nhật bàn thành công",
            error: "Cập nhật bàn thất bại",
          }
        )
        .then((res) => {
          onClose();
          setName("");
          setSelectedArea(0);
        });
      // dispatch(updateTable({ id: table.id, name }));
    } else {
      if (selectedArea === 0) return toast.error("Vui lòng chọn khu vực");
      if (name === "") return toast.error("Vui lòng nhập tên bàn");
      toast
        .promise(dispatch(createTable({ name, area_id: selectedArea })), {
          pending: "Đang tạo bàn",
          success: "Tạo bàn thành công",
          error: "Tạo bàn thất bại",
        })
        .then((res) => {
          onClose();
          setName("");
          setSelectedArea(0);
        });
    }
    // onClose();
  }

  useEffect(() => {
    table ? setName(table.name) : setName("");
    setSelectedArea(table ? table.area_id : 0);
    setNamesData([{ id: 0, name: "Chọn khu vực" }, ...areas]);
  }, [table, areas]);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Nhập tên bàn"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {areas.length > 0 && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Khu vực
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {areasData.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {table ? "Lưu" : "Tạo"}
        </button>
        <button
          onClick={onClose}
          className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Hủy
        </button>
      </div>
    </Portal>
  );
}
