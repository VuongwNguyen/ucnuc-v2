import { ShoppingBag } from "lucide-react";
import React, { memo } from "react";
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
      key={product.id}
      style={{ backgroundColor: randomColor }}
      className={`rounded-lg p-2 shadow relative m-2`}
    >
      <div className="flex flex-col w-full">
        <h3 className="text-lg font-medium mb-2 w-full">{product.name}</h3>
        <div className="relative w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-full mb-3"
          />
        </div>
        <div className="flex flex-1 flex-row justify-between items-center">
          <span className="text-gray-700">$123</span>
          <button className=" bg-secondary p-2 rounded-lg">
            <ShoppingBag size={24} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default memo(CardProduct);
