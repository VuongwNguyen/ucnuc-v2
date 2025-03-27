import React, { useEffect, useState } from "react";
import { getCategories } from "./../../api/Category.api";
import CreateNewCategory from "../../components/portal/CreateNewCategory";

import { fetchCategory } from './../../store/api';

function Category() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [curCategory, setCurCategory] = useState(null);
  useEffect(() => {
    getCategories({}, (data) => {
      setCategories(data.list);
    });
  }, []);

  return (
    <div>
      <CreateNewCategory
        onClose={() => setShowModal(false)}
        isOpen={showModal}
        category={curCategory}
      />
      <div className="flex justify-around items-center p-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={() => {
            setCurCategory(null);
            setShowModal(true);
          }}
        >
          Tạo danh mục mới
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 px-3">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="border bg-white rounded-lg shadow-md p-2 cursor-pointer"
            onClick={() => {
              setCurCategory(category);
              setShowModal(true);
            }}
          >
            <div className="text-4xl font-semibold text-gray-800 text-center">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
