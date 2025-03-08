import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { getCategories } from "../../api/Category.api";
import { createProduct } from "../../api/Product.api";
import { toast } from "react-toastify";

function CreateNewProduct({ onClose, isOpen, product }) {
  const [categories, setCategories] = useState([]);

  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState(product ? product.name : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [price, setPrice] = useState(product ? product.price : 0);
  const [discount, setDiscount] = useState(product ? product.discount : 0);
  const [category, setCategory] = useState(
    product ? product.category_id : null
  );
  const [flavor, setFlavor] = useState(product ? product.flavor : "");
  const [skus, setSkus] = useState(product ? product.skus : []);

  async function onCreateNewProduct(e) {
    e.preventDefault();
    if (!productName) return toast.warn("Vui lòng nhập tên sản phẩm!");
    if (!image) return toast.warning("Vui lòng chọn ảnh");
    if (!price) return toast.warn("Vui lòng nhập giá sản phẩm!");
    if (!category) return toast.warn("Vui lòng chọn danh mục sản phẩm!");
    if (!flavor) return toast.warn("Vui lòng chọn kiểu sản phẩm!");
    skus.length > 0 &&
      skus.forEach((sku) => {
        if (!sku.name) return toast.warn("Vui lòng nhập tên SKU!");
        if (!sku.price) return toast.warn("Vui lòng nhập giá SKU!");
        if (!sku.sale_price) return toast.warn("Vui lòng nhập giá khuyến mãi!");
        if (!sku.sku) return toast.warn("Vui lòng nhập SKU!");
      });

    toast.promise(
      createProduct(
        {
          name: productName,
          description,
          image,
          price,
          discount,
          category_id: category,
          flavor,
          skus,
        },
        (res) => {
          setImage(null);
          setProductName("");
          setDescription("");
          setPrice(0);
          setDiscount(0);
          setCategory(null);
          setFlavor("");
          setSkus([]);
          onClose();
        }
      ),
      {
        pending: "Đang tạo sản phẩm...",
        success: "Tạo sản phẩm thành công!",
        error: "Tạo sản phẩm thất bại!",
      }
    );
  }

  async function onUpdateProduct(e) {}

  useEffect(() => {
    getCategories({ limit: 100, page: 1 }, (data) => {
      setCategories([
        {
          id: "",
          name: "- Chọn danh mục -",
        },
        ...data.list,
      ]);
    });
  }, []);
  return (
    <Portal onClose={onClose} isOpen={isOpen}>
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {product ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tên sản phẩm
          </label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
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
             {image?
              <img
                src={URL.createObjectURL(image)}
                className="mx-auto h-20 w-20 "
                alt="image"
              />
              :
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
              </svg>} 
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Giá</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Giá giảm
          </label>
          <input
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Kiểu sản phẩm
          </label>
          <div className="justify-evenly flex mt-1">
            <label htmlFor="sweet">
              <input
                onChange={(e) => setFlavor("sweet")}
                type="radio"
                id="sweet"
                name="flavor"
                className="mr-1"
              />
              Ngọt
            </label>
            <label htmlFor="savory">
              <input
                onChange={(e) => setFlavor("savory")}
                type="radio"
                id="savory"
                name="flavor"
                className="mr-1"
              />
              Mặn
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Danh mục
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)} // Thêm logic xử lý ở đây nếu cần
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                // onChange={(e) => setCategory(category._id)}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {skus.length > 0 &&
          skus.map((sku, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  SKU {index + 1}
                </label>
                <button
                  onClick={() => {
                    const newSkus = [...skus];
                    newSkus.splice(index, 1);
                    setSkus(newSkus);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg shadow-md"
                >
                  Xóa
                </button>
              </div>

              <input
                value={sku.name}
                placeholder="Tên SKU"
                onChange={(e) => {
                  const newSkus = [...skus];
                  newSkus[index].name = e.target.value;
                  setSkus(newSkus);
                }}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text"
              />
              <input
                placeholder="Giá"
                value={sku.price}
                onChange={(e) => {
                  const newSkus = [...skus];
                  newSkus[index].price = e.target.value;
                  setSkus(newSkus);
                }}
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text"
              />
              <input
                placeholder="Giá khuyến mãi"
                value={sku.sale_price}
                onChange={(e) => {
                  const newSkus = [...skus];
                  newSkus[index].sale_price = e.target.value;
                  setSkus(newSkus);
                }}
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text"
              />
              <input
                placeholder="SKU"
                value={sku.sku}
                onChange={(e) => {
                  const newSkus = [...skus];
                  newSkus[index].sku = e.target.value;
                  setSkus(newSkus);
                }}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text"
              />
            </div>
          ))}

        <div className="flex justify-between">
          <button
            onClick={() =>
              setSkus([
                ...skus,
                {
                  name: "",
                  price: 0,
                  sale_price: 0,
                  sku: "",
                },
              ])
            }
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Thêm SKU
          </button>
          <button
            onClick={product ? onUpdateProduct : onCreateNewProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
          >
            {product ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default CreateNewProduct;
