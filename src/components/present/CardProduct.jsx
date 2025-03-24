import { ShoppingBag } from "lucide-react";
import React, { memo } from "react";
import { priceFormatter } from "../../util/priceFormatter";
import { useDispatch } from "react-redux";
const colors = ["#FEE6EC", "#FFDFC7",]; //


// Hàm để chọn màu ngẫu nhiên
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

function CardProduct({ product, onClick }) {
  const randomColor = getRandomColor();
  const dispatch = useDispatch();

  return (
    <div
      key={product?.id}
      style={{ backgroundColor: randomColor }}
      className={`rounded-lg p-2 shadow relative m-2`}
    >
      {/* tag */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs bg-primary text-white p-1 rounded-lg">
          {product?.category?.name}
        </span>
        {product?.sale_price != 0 && (
          <span className="text-xs bg-red-500 text-white p-1 rounded-lg">
            Giảm giá
          </span>
        )}
        {product?.skus.length > 1 && (
          <span className="text-xs bg-green-500 text-white p-1 rounded-lg">
            {product?.skus.length - 1} lựa chọn khác
          </span>
        )}
      </div>
      <div className="flex flex-col w-full">
        <h3 className="text-lg font-medium mb-2 w-full">{product?.name}</h3>
        <div className="relative w-full">
          <img
            src={product?.avatar_url}
            alt={product?.name}
            className="w-full object-scale-down object- mb-3 rounded-lg"
          />
        </div>
        <div className="flex flex-1 flex-row justify-between items-center">
          <div className="flex flex-1 flex-col">
            {product.sale_price != 0 && (
              <span className="line-through text-red-500">
                {priceFormatter(product?.price).formattedPrice}
              </span>
            )}
            <span className="text-gray-700 font-semibold text-lg">
              {
                priceFormatter(product?.price, product?.sale_price)
                  .formattedPrice
              }
            </span>
          </div>

          <button
            className=" bg-secondary p-2 rounded-lg"
            onClick={() => onClick()}
          >
            <ShoppingBag size={24} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default memo(CardProduct);
