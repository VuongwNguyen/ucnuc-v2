import React, { useEffect, useState } from "react";
import { getCategories } from "./../../api/Category.api";
import CreateNewCategory from "../../components/portal/CreateNewCategory";

function Category() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getCategories({}, (data) => {
      setCategories(data.list);
    });
  }, []);

  function onOpenModal(edit = false, { id, name, description, image }) {
    setShowModal(true);

    if (edit) {
      console.log("Edit");
    }
  }

  //  console.log(categories);

  return (
    <div>
      <CreateNewCategory
        onClose={() => setShowModal(false)}
        isOpen={showModal}
      />
      <div className="flex justify-around items-center p-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={onOpenModal.bind(this, false)}
        >
          Tạo danh mục mới
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 px-3">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="border bg-white rounded-lg shadow-md p-2 cursor-pointer"
            onClick={onOpenModal.bind(this, true, category)}
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
