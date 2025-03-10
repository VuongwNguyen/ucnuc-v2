import React, { useEffect, useState } from "react";
import CreateNewProduct from "../../components/portal/CreateNewProduct";
import { getProducts } from "./../../api/Product.api";
import Masonry from "react-masonry-css";
import CardProduct from "../../components/present/CardProduct";

export default function Product() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProducts({ limit: 10, page: 1 }, (data) => {
      setProducts(data.list);
    });
  }, []);
  return (
    <div>
      <CreateNewProduct
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        product={product}
      />
      <div className="flex justify-around items-center p-4">
        <button
          onClick={() => {
            setProduct(null);
            setIsOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Tạo sản phẩm mới
        </button>
        <button className="bg-lime-500 text-white px-4 py-2 rounded-lg shadow-md">
          Nhập từ Excel
        </button>
        {/* <button
          onClick={() => {}}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
           Bỏ chọn tất cả
        </button> */}
      </div>
      <div className="flex flex-col md:flex-row items-center p-4 gap-4 md:gap-0 justify-evenly">
        {/* Checkbox "Chọn tất cả" */}
        {/* <div className="flex items-center w-full md:w-auto">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            // onChange={() => {}}
          />
          <p className="text-sm md:text-base">Chọn tất cả</p>
        </div> */}

        {/* Lọc theo danh mục */}
        <div className="flex items-center w-full md:w-auto ">
          <span className="mr-2 text-sm md:text-base whitespace-nowrap">
            Lọc theo danh mục:
          </span>
          <select
            className="w-full md:w-auto border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            // onChange={() => {}}
          >
            <option value="1">Tất cả</option>
            <option value="2">Danh mục 1</option>
            <option value="3">Danh mục 2</option>
          </select>
        </div>

        {/* Tìm kiếm */}
        <div className="flex items-center w-full md:w-auto">
          <span className="mr-2 text-sm md:text-base whitespace-nowrap">
            Tìm kiếm:
          </span>
          <input
            type="text"
            className="w-full md:w-auto border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            // onChange={() => {}}
          />
        </div>

        {/* Nút Tìm kiếm */}
        <button className="w-full md:w-auto bg-blue-500 text-white px-4 py-1.5 rounded-lg shadow-md text-sm md:text-base hover:bg-blue-600 transition-colors">
          Tìm kiếm
        </button>
      </div>
      <div className="mx-auto">
        <Masonry
          breakpointCols={{
            default: 6, // Mặc định 4 cột cho desktop
            1300: 4, // 4
            1100: 3, // 3 cột cho màn hình từ 1100px (tablet)
            700: 2, // 2 cột cho màn hình từ 700px (mobile)
          }} // Cấu hình số cột
          className="flex flex-wrap" // Khoảng cách giữa các item
          columnClassName="flex flex-col items-center" // Lớp cho mỗi cột
        >
          {/* Map qua dữ liệu sản phẩm */}
          {products.map((product) => {
            return (
              <CardProduct
                key={product.id}
                product={product}
                onClick={() => {
                  setProduct(product);
                  setIsOpen(true);
                }}
              />
            );
          })}
        </Masonry>
      </div>
    </div>
  );
}
