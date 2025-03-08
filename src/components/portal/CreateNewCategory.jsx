import React, { useState } from "react";
import Portal from "./Portal";
import { createCategory } from "../../api/Category.api";
import { toast } from "react-toastify";

function CreateNewCategory({ onClose, isOpen }) {
  const [nameCategory, setNameCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  async function onCreateNewCategory() {
    if (!nameCategory) return toast.error("Vui lòng nhập tên danh mục!");

    toast.promise(
      createCategory(
        {
          name: nameCategory,
          description,
          image,
        },
        (res) => {
          onClose();
        }
      ),
      {
        pending: "Đang tạo danh mục...",
        success: "Tạo danh mục thành công!",
        error: "Tạo danh mục thất bại!",
      }
    );
  }

  return (
    <Portal onClose={onClose} isOpen={isOpen}>
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tên danh mục
          </label>
          <input
            value={nameCategory}
            onChange={(e) => setNameCategory(e.target.value)}
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <label className="block text-sm font-medium text-gray-700">Ảnh</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <label
            htmlFor="file-upload"
            className="cursor-pointer w-full h-full flex justify-center" // Mở rộng label full vùng
          >
            <div className="space-y-1 text-center">
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
              >
                <path
                  d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                  stroke="#1C274C"
                />
                <path
                  d="M12 16V3M12 3L16 7.375M12 3L8 7.375"
                  stroke="#1C274C"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <span className="relative bg-white rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  Upload a file
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              // value={image} // Lưu ý: input type="file" không dùng value, tao sẽ giải thích thêm
              onChange={(e) => setImage(e.target.files[0])} // Lấy file thay vì value
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only" // Ẩn input nhưng vẫn hoạt động
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCreateNewCategory}
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Lưu
          </button>

          <button
            type="button"
            className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default CreateNewCategory;
