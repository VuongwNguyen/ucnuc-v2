import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { createCategory, updateCategory } from "../../store/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

function CreateNewCategory({ onClose, isOpen, category }) {
  const dispatch = useDispatch();
  const [nameCategory, setNameCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (category) {
      setNameCategory(category.name || "");
      setDescription(category.description || "");
      setAvatarUrl(category.avatar_url || "");
    }
  }, [category]);

  async function onUpdateCategory() {
    if (!nameCategory) return toast.error("Vui lòng nhập tên danh mục!");

    toast.promise(
      dispatch(
        updateCategory({
          id: category.id,
          name: nameCategory,
          description,
          image,
        })
      ),
      {
        pending: "Đang cập nhật danh mục...",
        success: "Cập nhật danh mục thành công!",
        error: "Cập nhật danh mục thất bại!",
      }
    );
  }

  async function onCreateNewCategory() {
    if (!nameCategory) return toast.error("Vui lòng nhập tên danh mục!");

    toast.promise(
      dispatch(
        createCategory({
          name: nameCategory,
          description,
          image,
        })
      ),
      {
        pending: "Đang tạo danh mục...",
        success: "Tạo danh mục thành công!",
        error: "Tạo danh mục thất bại!",
      }
    );
  }

  async function onClosee() {
    setDescription("");
    setImage(null);
    setNameCategory("");
    onClose();
  }
  return (
    <Portal onClose={onClosee} isOpen={isOpen}>
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {category ? "Sửa" : "Tạo"} danh mục
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
              {image || avatar_url ? (
                <img
                  src={image ? URL.createObjectURL(image) : avatar_url}
                  className="mx-auto h-20 w-20 "
                  alt="image"
                />
              ) : (
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
              )}
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
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={category ? onUpdateCategory : onCreateNewCategory}
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {category ? "Cập nhật" : "Tạo mới"}
          </button>

          <button
            type="button"
            className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={onClosee}
          >
            Hủy
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default CreateNewCategory;
