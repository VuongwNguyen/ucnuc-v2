import { ShoppingBag } from "lucide-react";
import React, { memo } from "react";
import { priceFormatter } from "../../util/priceFormatter";
import { useDispatch } from "react-redux";

const colors = ["#FEE6EC", "#FFDFC7"];

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
      className="group relative bg-white rounded-2xl overflow-hidden mt-2"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={product?.avatar_url}
          alt={product?.name}
          className="w-full h-full object-scale-down group-hover:scale-[1.02] transition-transform duration-500"
        />
        {/* Category Tag */}
        <div className="absolute top-3 right-3">
          <span className="text-[10px] tracking-wider bg-white/90 text-primary/90 px-3 py-1.5 rounded-full font-medium uppercase shadow-sm">
            {product?.category?.name}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-3">
          {product?.name}
        </h3>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            {product.sale_price != 0 && (
              <span className="block text-xs text-gray-400 line-through mb-0.5">
                {priceFormatter(product?.price).formattedPrice}
              </span>
            )}
            <span className="text-lg font-semibold text-gray-900">
              {priceFormatter(product?.price, product?.sale_price).formattedPrice}
            </span>
          </div>

          <button
            className="bg-secondary p-2 rounded-full hover:bg-secondary/90 transition-colors duration-300"
            onClick={() => onClick()}
          >
            <ShoppingBag size={18} color="white" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-3">
          {product?.sale_price != 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">
              Giảm giá
            </span>
          )}
          {product?.skus.length > 1 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
              {product?.skus.length - 1} lựa chọn
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(CardProduct);
