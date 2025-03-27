import { ShoppingBag, Star, Tag } from "lucide-react";
import React, { memo } from "react";
import { priceFormatter } from "../../util/priceFormatter";
import { useDispatch } from "react-redux";

const colors = [
  "bg-gradient-to-br from-pink-50 to-rose-50",
  "bg-gradient-to-br from-orange-50 to-amber-50",
  "bg-gradient-to-br from-blue-50 to-indigo-50",
  "bg-gradient-to-br from-green-50 to-emerald-50",
  "bg-gradient-to-br from-purple-50 to-violet-50",
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

function CardProduct({ product, onClick }) {
  const randomColor = getRandomColor();
  const dispatch = useDispatch();

  // Tính toán giá hiển thị
  const displayPrice = product?.sale_price > 0 ? product?.sale_price : product?.price;
  const originalPrice = product?.sale_price > 0 ? product?.price : null;

  return (
    <div
      key={product?.id}
      className={`${randomColor} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 relative m-2 group`}
    >
      {/* Image Container */}
      <div className="relative mb-4">
        <div className="aspect-square rounded-xl overflow-hidden bg-white/50 p-2">
          <img
            src={product?.avatar_url}
            alt={product?.name}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <button
          className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:bg-primary hover:text-white"
          onClick={() => onClick()}
        >
          <ShoppingBag size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-white/80 backdrop-blur-sm text-primary px-2 py-1 rounded-full flex items-center">
            <Tag className="w-3 h-3 mr-1" />
            {product?.category?.name}
          </span>
          {product?.sale_price > 0 && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Giảm giá
            </span>
          )}
          {product?.skus.length > 1 && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              {product?.skus.length - 1} lựa chọn
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
          {product?.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {originalPrice && (
              <div className="flex flex-col">
                <span className="text-sm line-through text-gray-400">
                  {priceFormatter(originalPrice).formattedPrice}
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {priceFormatter(displayPrice).formattedPrice}
                </span>
              </div>
            )}
            {!originalPrice && (
              <span className="text-lg font-semibold text-gray-900">
                {priceFormatter(displayPrice).formattedPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CardProduct);
