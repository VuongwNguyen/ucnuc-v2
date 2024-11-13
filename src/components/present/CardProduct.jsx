import { ShoppingBag } from "lucide-react";
import React, { memo } from "react";
import Product from "../../dao/model/Product";
const colors = ["#FEE6EC", "#FFDFC7", "#F1F1F1"];

// Hàm để chọn màu ngẫu nhiên
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

function CardProduct({ product }) {
  const randomColor = getRandomColor();
  return (
    <div
      key={product?.id}
      style={{ backgroundColor: randomColor }}
      className={`rounded-lg p-2 shadow relative m-2`}
    >
      {/* tag */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs bg-primary text-white p-1 rounded-lg">
          {product?.category_name}
        </span>
        {product?.discount && (
          <span className="text-xs bg-red-500 text-white p-1 rounded-lg">
            Giảm giá
          </span>
        )}
        {product?.option?.length > 1 && (
          <span className="text-xs bg-green-500 text-white p-1 rounded-lg">
            {product?.option.length - 1} lựa chọn khác
          </span>
        )}
      </div>
      <div className="flex flex-col w-full">
        <h3 className="text-lg font-medium mb-2 w-full">
          {product?.option[0]?.name}
        </h3>
        <div className="relative w-full">
          <img
            src={product?.image}
            alt={product?.option[0]?.name}
            className="w-full h-48 object-cover rounded-full mb-3"
          />
        </div>
        <div className="flex flex-1 flex-row justify-between items-center">
          <div className="flex flex-1 flex-col">
            <span className="line-through text-red-500">
              {Product.formatCurrency(product?.option[0]?.price)}
            </span>
            <span className="text-gray-700">
              {Product.priceFormatter(
                product?.option[0]?.price,
                product?.discount
              )}
            </span>
          </div>

          <button className=" bg-secondary p-2 rounded-lg">
            <ShoppingBag size={24} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default memo(CardProduct);
