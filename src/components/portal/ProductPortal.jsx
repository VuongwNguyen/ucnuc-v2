import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { toast } from "react-toastify";
import { Minus, Plus } from "lucide-react";
import Category from "./../../dao/model/Category";
import Product from "./../../dao/model/Product";
import { v4 as uuidv4 } from "uuid";
import { handleUpload, handleDelete } from "../../dao/cloudinnary";

export default function ProductPortal({ isOpen, onClose }) {
  const [showAdd, setShowAdd] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      Category.read((data) => {
        setCategories(data);
      });
    }
    fetchCategories();
  }, []);
  console.log(products);

  useEffect(() => {
    async function fetchProducts() {
      Product.read((data) => {
        setProducts(data);
      });
    }
    fetchProducts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !price || !discount || !category_id || !image) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const promise = new Promise(async (resolve, reject) => {
      const id = uuidv4();
      const imageUrl = await handleUpload(image);

      const product = new Product(
        id,
        name,
        price,
        discount,
        category_id,
        imageUrl
      );
      try {
        await product.create();
        resolve();
      } catch (error) {
        reject();
      }
    });
    toast
      .promise(promise, {
        loading: "Đang thêm sản phẩm...",
        success: "Thêm sản phẩm thành công",
        error: "Thêm sản phẩm thất bại",
      })
      .then(() => {
        setName("");
        setPrice("");
        setDiscount("");
        setCategory_id("");
        setImage(null);
      });
  }

  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-row justify-between">
        <h2>Quản lý sản phẩm</h2>
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
      {showAdd && (
        <div className="mt-4">
          <h3>Thêm sản phẩm</h3>
          <form
            className="gap-3 flex flex-col"
            onSubmit={async (e) => {
              handleSubmit(e);
            }}
          >
            <div className="flex flex-col">
              <label htmlFor="name">Tên sản phẩm</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex flex-col flex-1">
                <label htmlFor="price">Giá sản phẩm</label>
                <input
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  className="border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor="discount">Giảm giá</label>
                <input
                  type="number"
                  onChange={(e) => setDiscount(e.target.value)}
                  value={discount}
                  className="border border-gray-300 p-2 rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="category">Danh mục</label>
              <select
                name="category"
                id="category"
                className="border border-gray-300 p-2 rounded-lg"
                onChange={(e) => setCategory_id(e.target.value)}
              >
                <option value="">{category_id && "Chọn danh mục"}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="image">Hình ảnh</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-lg"
            >
              Thêm sản phẩm
            </button>
          </form>
        </div>
      )}
      {
        <div className="mt-4">
          <h3>Danh sách sản phẩm</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Giảm giá</th>
                <th>Danh mục</th>
                <th>Hình ảnh</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.discount}</td>
                  <td>{product.category_id}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </Portal>
  );
}
