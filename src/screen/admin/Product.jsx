import React, { useEffect, useState } from "react";
import CreateNewProduct from "../../components/portal/CreateNewProduct";
import { getProducts } from "./../../api/Product.api";
import Masonry from "react-masonry-css";
import CardProduct from "../../components/present/CardProduct";
import { Plus, Upload, Search, Filter, Package } from "lucide-react";

export default function Product() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    getProducts({ limit: 10, page: 1 }, (data) => {
      setProducts(data.list);
    });
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-gray-500 mt-1">Tổng số sản phẩm: {products.length}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setProduct(null);
              setIsOpen(true);
            }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo sản phẩm mới</span>
          </button>
          <button className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            <span>Nhập từ Excel</span>
          </button>
        </div>
      </div>

      <CreateNewProduct
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        product={product}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Lọc theo danh mục */}
          <div className="flex items-center w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-500 mr-2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="1">Danh mục 1</option>
              <option value="2">Danh mục 2</option>
            </select>
          </div>

          {/* Tìm kiếm */}
          <div className="flex items-center w-full md:w-auto">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full md:w-64 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Nút Tìm kiếm */}
          <button className="w-full md:w-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="mx-auto">
        <Masonry
          breakpointCols={{
            default: 6,
            1300: 4,
            1100: 3,
            700: 2,
          }}
          className="flex flex-wrap gap-4"
          columnClassName="flex flex-col items-center"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => {
                      setProduct(product);
                      setIsOpen(true);
                    }}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                </div>
                <div className="text-sm text-gray-500">
                  {product.category?.name || "Chưa phân loại"}
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
}
