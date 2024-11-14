import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { toast } from "react-toastify";
import { Minus, Plus } from "lucide-react";
import Category from "./../../dao/model/Category";
import Product from "./../../dao/model/Product";
import { handleUpload, handleDelete } from "../../dao/cloudinnary";
import OptionProduct from "../business/OptionProduct";
import { NumericFormat } from "react-number-format";
import BusinessProduct from "../business/BusinessProduct";

export default function ProductPortal({ isOpen, onClose }) {
  const [showAdd, setShowAdd] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [discount, setDiscount] = useState("");
  const [displayDiscount, setDisplayDiscount] = useState("");
  const [options, setOptions] = useState([{ name: "", price: "" }]);
  const [category_id, setCategory_id] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      Category.read((data) => {
        setCategories([{ name: "Chọn danh mục", id: null }, ...data]);
      });
    }
    fetchCategories();
  }, []);

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
    if (!category_id || !image) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const validOptions = options.every((option) => option.name && option.price);
    if (!validOptions) {
      toast.error(
        "Vui lòng điền đầy đủ thông tin cho tùy chọn, nếu không hãy xóa tùy chọn đó"
      );
      return;
    }

    toast
      .promise(
        new Promise(async (resolve, reject) => {
          try {
            await createNewProduct();
            resolve("Thêm sản phẩm thành công");
          } catch (error) {
            reject("Thêm sản phẩm thất bại");
            console.log(error);
          }
        }),
        {
          pending: "Đang thêm sản phẩm...",
          success: "Thêm sản phẩm thành công",
          error: "Thêm sản phẩm thất bại",
        }
      )
      .then(() => {
        setOptions([{ name: "", price: "" }]);
        setImage(null);
        setCategory_id("");
        setDiscount("");
        setDisplayDiscount("");
        document.getElementById("inputFile").value = "";
        document.getElementById("category").value = categories[0].name;
      });
  }

  async function createNewProduct() {
    try {
      const product = new Product(options, category_id, discount);
      const url = await handleUpload(image);
      product.image = url.secure_url;
      return product.create();
    } catch (error) {
      console.log(error);
      throw new Error("Error adding document");
    }
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
            <span>
              <span className="text-red-500 underline">*Lưu ý:</span> option đầu
              tiên sẽ là tên và giá gốc được hiển thị cho khách xem bắt buộc
              phải có, giá giảm không có cũng được nếu không có chương trình
              giảm
            </span>
            <div className="flex flex-col">
              <label htmlFor="category">Danh mục</label>
              <select
                name="category"
                id="category"
                className="border border-gray-300 p-2 rounded-lg"
                onChange={(e) => setCategory_id(e.target.value)}
              >
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
                id="inputFile"
                onChange={(e) => setImage(e.target.files[0])}
                className="border border-gray-300 p-2 rounded-lg"
              />
            </div>
            {options.map((option, index) => (
              <OptionProduct
                key={index}
                options={options}
                setOptions={setOptions}
                index={index}
              />
            ))}
            <div className="flex flex-col flex-1">
              <label htmlFor="price">Khuyến mãi</label>
              <NumericFormat
                value={displayDiscount}
                onValueChange={(values) => {
                  const { value } = values;
                  setDisplayDiscount(value);
                  setDiscount(value.replace(/[^0-9]/g, ""));
                }}
                thousandSeparator=","
                suffix=" ₫"
                className="border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="flex flex-1 flex-row justify-around gap-2 w-full">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setOptions([...options, { name: "", price: "" }]);
                }}
                className="bg-secondary text-white p-2 rounded-lg"
              >
                Thêm tùy chọn
              </button>
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-lg"
              >
                Thêm sản phẩm
              </button>
            </div>
          </form>
        </div>
      )}
      {
        <div className="mt-4">
          {products.map((product) => (
            <BusinessProduct product={product} key={product.id} />
          ))}
        </div>
      }
    </Portal>
  );
}
