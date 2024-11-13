import { Search, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Masonry from "react-masonry-css";
import CardProduct from "../components/present/CardProduct";
import CardCategory from "../components/present/CardCategory";
import Product from "./../dao/model/Product";
import Category from "../dao/model/Category";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [cateSelected, setCateSelected] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch products when category or search term changes
  useEffect(() => {
    async function fetchProducts() {
      Product.read((data) => {
        setProducts(data); // Update the products state with the fetched data
      }, cateSelected);
    }

    fetchProducts(); // Call the fetch function
  }, [cateSelected]); // Depend on cateSelected and debouncedSearchTerm

  console.log(debouncedSearchTerm);
  useEffect(() => {
    async function fetchCategory() {
      Category.read((data) => {
        setCategories([{ name: "Tất cả", id: null }, ...data]);
      });
    }
    fetchCategory();
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex flex-1 flex-row justify-between container mt-2 items-center relative">
        <h1 className="text-black truncate">Úc Núc</h1>
        <button className="flex items-center justify-center w-12 h-12 p-3 bg-secondary text-white rounded-xl">
          <ShoppingCart color="white" />
        </button>
      </div>
      {/* Search bar */}
      <div className="container mt-2 relative">
        <div className="flex items-center border border-gray-300 rounded-xl">
          <input
            className="w-full p-3 rounded-xl outline-none"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm"
          />
          <div className="p-3">
            <Search />
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="container mt-2">
        <h2 className="text-black">Danh mục</h2>
        <div className="flex flex-1 flex-row overflow-y-auto">
          {categories.map((cate) => (
            <CardCategory
              cate={cate}
              cateSelected={cateSelected}
              onClick={() => setCateSelected(cate.id)}
            />
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="container mt-3">
        <h2 className="text-black">Sản phẩm</h2>
        <div className="mx-auto">
          <Masonry
            breakpointCols={{
              default: 4, // Mặc định 4 cột cho desktop
              1100: 3, // 3 cột cho màn hình từ 1100px (tablet)
              700: 2, // 2 cột cho màn hình từ 700px (mobile)
            }} // Cấu hình số cột
            className="flex flex-wrap" // Khoảng cách giữa các item
            columnClassName="flex flex-col items-center" // Lớp cho mỗi cột
          >
            {/* Map qua dữ liệu sản phẩm */}
            {products.map((product) => {
              return <CardProduct product={product} />;
            })}
          </Masonry>
        </div>
      </div>
    </div>
  );
}
