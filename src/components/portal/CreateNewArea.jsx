import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { createArea, getAreas, updateArea } from "../../store/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

export default function CreateNewArea({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [areaSelected, setAreaSelected] = useState(null);
  const { areas } = useSelector((state) => state.tableArea);

  useEffect(() => {
    dispatch(getAreas({ limit: 1000, page: 1 }));
  }, []);

  function onCreateArea() {
    if (!name) return toast.error("Vui lòng nhập tên khu vực");

    toast.promise(dispatch(createArea({ name })), {
      pending: "Đang xử lý",
      success: "Tạo khu vực thành công",
      error: "Tạo khu vực thất bại",
    }).then((res) => {
      setName("");
      onClose();
    });
  }

  function onUpdateArea() {
    if (!areaSelected) return toast.error("Vui lòng chọn khu vực");
    if (!areaSelected.name) return toast.error("Vui lòng nhập tên khu vực");

    toast.promise(
      dispatch(updateArea({ name:areaSelected.name, id: areaSelected.id })),
      {
        pending: "Đang xử lý",
        success: "Cập nhật khu vực thành công",
        error: "Cập nhật khu vực thất bại",
      }
    ).then((res) => {
      setName("");
      setAreaSelected(null);
      onClose();
    });
  }


  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-lg font-medium text-gray-900"></h2>
        <p className="text-sm text-gray-500">Vui lòng nhập thông tin khu vực</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Tên khu vực
        </label>
        <input
          value={areaSelected ? areaSelected.name : name}
          onChange={(e) =>
            areaSelected
              ? setAreaSelected({ ...areaSelected, name: e.target.value })
              : setName(e.target.value)
              //nếu có khu vực được chọn thì cập nhật tên khu vực đã chọn
              //nếu không có khu vực được chọn thì cập nhật tên khu vực mới
          }
          type="text"
          placeholder="Nhập tên khu vực"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={areaSelected ? onUpdateArea : onCreateArea}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          {areaSelected ? "Cập nhật khu vực" : "Tạo khu vực"}
        </button>
        {areaSelected && (
          <button
            onClick={() => {
              setName("");
              setAreaSelected(null);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Hủy
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <table>
          <thead>
            <tr>
              <th className="border-collapse border border-gray-300 p-2 text-center">
                <h3>Danh sách khu vực</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                <td className="border-collapse border border-gray-300 p-2">
                  <input
                    type="radio"
                    id={area.id}
                    name="area"
                    checked={areaSelected?.id === area.id}
                    onChange={() => setAreaSelected(area)}
                  />
                  <label htmlFor={area.id} className="cursor-pointer ml-2">
                    {area.name}
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Portal>
  );
}
