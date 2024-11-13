import React, { memo, useEffect, useState } from "react";
import Product from "../../dao/model/Product";
import OptionProduct from "./OptionProduct";
import { NumericFormat } from "react-number-format";
import Category from "../../dao/model/Category";
import { toast } from "react-toastify";
import { handleUpload, handleDelete } from "../../dao/cloudinnary";

const colors = ["#FEE6EC", "#FFDFC7", "#F1F1F1"];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

function BusinessProduct({ product }) {
  const [showEdit, setShowEdit] = useState(false);
  const [options, setOptions] = useState(product?.option);
  const [discount, setDiscount] = useState(product?.discount);
  const [displayDiscount, setDisplayDiscount] = useState(
    Product.formatCurrency(product?.discount)
  );
  const [category_id, setCategory_id] = useState(product?.category_id);
  const [image, setImage] = useState(product?.image);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      Category.read((data) => {
        setCategories([{ name: "Chọn danh mục", id: null }, ...data]);
      });
    }
    fetchCategories();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(image);

    // Kiểm tra thông tin cần thiết trước khi tiếp tục
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

    // Toast xử lý promise một cách gọn gàng hơn
    toast
      .promise(updateProduct(), {
        pending: "Đang sửa sản phẩm...",
        success: "Sửa sản phẩm thành công",
        error: "Sửa sản phẩm thất bại",
      })
      .then(() => {
        setShowEdit((prev) => !prev);
      })
      .catch((error) => {
        console.error("Update failed:", error);
      });
  }

  async function updateProduct() {
    try {
      let updatedImage = image;

      // Nếu image là object, xử lý upload trước
      if (typeof image === "object") {
        const url = await handleUpload(image);
        updatedImage = url.secure_url; // Đảm bảo set giá trị đúng từ kết quả upload
      }

      // Gọi phương thức update của Product
      await Product.update({
        id: product.id,
        options,
        category_id,
        discount,
        image: updatedImage, // Sử dụng hình ảnh đã được upload (nếu có)
        created_at: product.created_at,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Sửa sản phẩm thất bại");
    }
  }

  return (
    <div
      key={product.id}
      style={{ backgroundColor: getRandomColor() }}
      className="flex flex-1 flex-row justify-between m-2 rounded-lg p-2 shadow"
    >
      {showEdit || (
        <div className="flex flex-row gap-3">
          <img src={product.image} alt="product" className="w-20 h-20" />
          <div className="flex flex-col gap-2">
            {product.option.map((option, index) => (
              <div key={option.id} className="flex flex-row gap-2">
                <span className="truncate">{option.name}</span>
                {product.discount && (
                  <span className="line-through">
                    {Product.formatCurrency(option.price)}
                  </span>
                )}
                <span>
                  {Product.priceFormatter(option.price, product.discount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showEdit || (
        <div className="flex flex-col justify-around">
          <button className="bg-red-500 text-white p-1 rounded-lg">Ẩn</button>
          <button
            onClick={() => setShowEdit((prev) => !prev)}
            className="bg-yellow-500 text-white p-1 rounded-lg"
          >
            Sửa
          </button>
        </div>
      )}

      {showEdit && (
        <div className="mt-4">
          <h3>Sửa sản phẩm</h3>
          <form
            className="gap-3 flex flex-col"
            onSubmit={async (e) => {
              handleSubmit(e);
            }}
          >
            <span>
              <span className="text-red-500 underline">*Lưu ý:</span> Các thay
              đổi mà chưa nhấn xác nhận sẽ không được lưu, ngoài ra các thuộc
              tính không thay đổi sẽ không bị ảnh hưởng
            </span>
            <div className="flex flex-col">
              <label htmlFor="category">Danh mục</label>
              <select
                name="category"
                id="category"
                className="border border-gray-300 p-2 rounded-lg"
                onChange={(e) => setCategory_id(e.target.value)}
                value={category_id} // Đặt value cho <select>
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
                type="button"
                onClick={() => setShowEdit((prev) => !prev)}
                className="bg-yellow-500 text-white p-2 rounded-lg"
              >
                Huỷ sửa
              </button>
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
                type="button"
                className="bg-primary text-white p-2 rounded-lg"
                onClick={(e) => handleSubmit(e)}
              >
                Sửa sản phẩm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
export default memo(BusinessProduct);
