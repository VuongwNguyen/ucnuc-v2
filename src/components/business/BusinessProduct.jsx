import React, { memo, useState } from "react";
import Product from "../../dao/model/Product";
import OptionProduct from "./OptionProduct";
import { NumericFormat } from "react-number-format";

const colors = ["#FEE6EC", "#FFDFC7", "#F1F1F1"];

// Hàm để chọn màu ngẫu nhiên
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

function BusinessProduct({ product }) {
  const [showEdit, setShowEdit] = useState(true);
  const [options, setOptions] = useState(product.option);
  const [discount, setDiscount] = useState(product.discount);
  const [displayDiscount, setDisplayDiscount] = useState(
    Product.formatCurrency(product.discount)
  );
  const [category_id, setCategory_id] = useState(product.category_id);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

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
                <option value="null">Chọn danh mục</option>
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
                onClick={(e) => {
                  e.preventDefault();
                  setOptions([
                    ...options,
                    { name: "", price: "", discount: "" },
                  ]);
                }}
                className="bg-secondary text-white p-2 rounded-lg"
              >
                Thêm tùy chọn
              </button>
              <button
                type="button"
                onClick={() => setShowEdit((prev) => !prev)}
                className="bg-yellow-500 text-white p-2 rounded-lg"
              >
                Huỷ sửa
              </button>
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-lg"
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
