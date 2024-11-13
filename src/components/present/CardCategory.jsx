import React from "react";

export default function CardCategory({ onClick, cate, cateSelected }) {
  return (
    <button
      onClick={() => onClick()}
      className={`min-w-fit flex items-center justify-center p-3 rounded-xl m-2 font-medium ${
        cateSelected === cate.id
          ? "bg-secondary text-white"
          : "bg-gray-300 text-black"
      }`}
    >
      {cate.name}
    </button>
  );
}
