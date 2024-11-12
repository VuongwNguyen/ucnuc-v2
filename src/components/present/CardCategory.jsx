import React from "react";

export default function CardCategory({ onClick, cate, cateSelected }) {
  return (
    <button
      onClick={() => onClick()}
      className={`flex items-center justify-center w-full h-24 p-3 rounded-xl m-2 font-medium ${
        cateSelected === cate.id ? "bg-secondary" : "bg-gray-300"
      } ${cateSelected === cate.id ? "text-white" : "text-black"}`}
    >
      {cate.name}
    </button>
  );
}
