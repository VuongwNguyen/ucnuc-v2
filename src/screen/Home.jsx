import { Search, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Masonry from "react-masonry-css";
import CardProduct from "../components/present/CardProduct";
import CardCategory from "../components/present/CardCategory";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [cateSelected, setCateSelected] = useState(0);

  useEffect(() => {
    // if (debouncedSearchTerm) {
    //   console.log(debouncedSearchTerm);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex flex-1 flex-row justify-between container mt-3">
        <h1 className="text-black">Úc Núc</h1>
        <button className="flex items-center justify-center w-12 h-12 p-3 bg-secondary text-white rounded-xl">
          <ShoppingCart color="white" />
        </button>
      </div>
      {/* Search bar */}
      <div className="container mt-3 relative">
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
      <div className="container mt-3">
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
            {data.map((product) => {
              return <CardProduct product={product} />;
            })}
          </Masonry>
        </div>
      </div>
    </div>
  );
}

const data = [
  {
    id: 1,
    name: "Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
  {
    id: 2,
    name: "Product 2Product 2Product 2Product 2Product 2Product 2",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
  {
    id: 3,
    name: "Product 3Product 3Product 3Product 3",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
  {
    id: 4,
    name: "Product 4Product 4Product 4Product 4",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
  {
    id: 5,
    name: "Product 5Product 5Product 5Product 5Product 5",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
  {
    id: 6,
    name: "Product 6Product 6Product 6",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
  {
    id: 7,
    name: "Product 7",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
  {
    id: 8,
    name: "Product 8",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
  {
    id: 9,
    name: "Product 9",
    option: ["Option 1", "Option 2"],
    category_id: 1,
    image:
      "https://i.pinimg.com/474x/ea/67/f7/ea67f7d1f4911e3fc29a34665bb958a0.jpg",
  },
];

const categories = [
  {
    id: 0,
    name: "Tất cả",
  },
  {
    id: 1,
    name: "Đồ ăn",
  },
  {
    id: 2,
    name: "Đồ uống",
  },
  {
    id: 3,
    name: "Đồ chơi",
  },
];
