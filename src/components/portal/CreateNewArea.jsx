import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { createArea, getAreas } from "../../api/TableArea.api";
import { toast } from "react-toastify";

export default function CreateNewArea({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [areas, setAreas] = useState([]);
  const [areaSelected, setAreaSelected] = useState(null);

  useEffect(() => {
    getAreas({}, (data) => {
      setAreas(data.list);
    });
  }, []);

  function onCreateArea() {
    if (!name) return toast.error("Vui lòng nhập tên khu vực");

    toast.promise(
      createArea(
        {
          name,
        },
        (meta) => {
          if (meta) {
            setName("");
            getAreas({}, (data) => {
              setAreas(data.list);
            });
          }
        }
      ),
      {
        pending: "Đang xử lý",
        success: "Tạo khu vực thành công",
        error: "Tạo khu vực thất bại",
      }
    );
  }

  function onUpdateArea() {}

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
          }
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
