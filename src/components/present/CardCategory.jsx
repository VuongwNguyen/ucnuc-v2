import React from "react";
import { ChevronRight } from "lucide-react";

export default function CardCategory({ onClick, cate, cateSelected }) {
  return (
    <button
      onClick={() => onClick()}
      className={`
        group
        relative 
        inline-flex
        items-center
        px-3
        py-2.5
        text-xs
        rounded-lg
        transition-all duration-300
        ${
          cateSelected === cate.id
            ? "text-white"
            : "text-gray-500 hover:text-gray-800"
        }
      `}
    >
      {/* Background layers */}
      <div
        className={`
        absolute inset-0 
        transition-all duration-300
        rounded-lg
        ${cateSelected === cate.id ? "opacity-100 bg-primary" : "opacity-0"}
      `}
      />

      {/* Hover effect */}
      <div
        className={`
        absolute inset-0
        bg-gray-100
        rounded-lg
        transition-all duration-300
        ${
          cateSelected === cate.id
            ? "opacity-0"
            : "opacity-0 group-hover:opacity-100"
        }
      `}
      />

      {/* Content */}
      <span className="relative font-medium tracking-wide whitespace-nowrap">
        {cate.name}
      </span>

      {/* Arrow Icon */}
      <div
        className={`
        relative
        ml-2
        transition-all duration-300
        ${
          cateSelected === cate.id
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
        }
      `}
      >
        <ChevronRight
          size={14}
          strokeWidth={2.5}
          className={`
            transition-colors duration-300
            ${cateSelected === cate.id ? "text-white" : "text-gray-800"}
          `}
        />
      </div>
    </button>
  );
}
