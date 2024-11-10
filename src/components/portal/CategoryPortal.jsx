import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { toast } from "react-toastify";
import { Minus, Plus } from "lucide-react";
import Category from "../../dao/model/Category";
import { v4 as uuidv4 } from "uuid";

export default function CategoryPortal({ isOpen, onClose }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [categories, setCategories] = useState([]);
  async function handleCreateCategory(e) {
    e.preventDefault();
    const category = new Category(uuidv4(), name, description, tag);
    console.log(category);
    toast.promise(category.create(), {
      pending: "Đang tạo chủng loại ...",
      success: "Tạo chủng loai thành công",
      error: "Tạo chủng loại thất bại",
    });
  }
  useEffect(() => {
    async function fetchData() {
      const unsubscribe = await Category.read((categories) => {
        setCategories(categories);
      });
      return () => unsubscribe();
    }
    fetchData();
  }, []);
  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-row justify-between">
        <h2>Quản lý chủng loại</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`${
            showAdd ? "bg-red-500" : "bg-secondary"
          } text-white rounded-full p-2 active:bg-[#E2BFD9] h-full font-semibold`}
        >
          {!showAdd ? (
            <Plus size={24} color="white" />
          ) : (
            <Minus size={24} color="white" />
          )}
        </button>
      </div>
      <div>
        {showAdd && (
          <form
            onSubmit={(e) => {
              handleCreateCategory(e);
            }}
            className="flex flex-col gap-2 mt-3"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên chủng loại"
              required
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả"
              required
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Tag"
              required
              className="p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="bg-secondary text-white p-2 rounded-md"
            >
              Thêm
            </button>
          </form>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-row justify-between p-2 bg-gray-100 rounded-md"
          >
            <p className="truncate">{category.name}</p>
            <p>{category.description}</p>
            <p>{category.tag}</p>
          </div>
        ))}
      </div>
    </Portal>
  );
}
