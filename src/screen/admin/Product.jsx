import React, { useEffect, useState } from "react";
import CreateNewProduct from "../../components/portal/CreateNewProduct";
import { getProducts } from "./../../api/Product.api";
import Masonry from "react-masonry-css";
import CardProduct from "../../components/present/CardProduct";
import {
  Plus,
  Upload,
  Search,
  Filter,
  Package,
  BaggageClaim,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategory } from "../../store/api";
import useDebounce from "../../hooks/useDebounce";
import { priceFormatter } from "../../util/priceFormatter";

export default function Product() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(fetchCategory({ page: 1, limit: 1000 }));
  }, []);

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        limit: 1000,
        keyword: debouncedSearchTerm,
        category_id: selectedCategory,
      })
    );
  }, [debouncedSearchTerm, selectedCategory]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản lý sản phẩm
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng số sản phẩm: {products?.list?.length}
          </p>
        </div>
        <div className="flex gap-3 sm:flex-row flex-col">
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
          <button className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors shadow-sm">
            <BaggageClaim className="w-4 h-4" />
            <span>Quản lí món thêm</span>
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
              {categories?.list?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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
        </div>
      </div>

      <div className="mx-auto">
        <Masonry
          breakpointCols={{
            default: 6,
            1400: 4,
            1100: 3,
            700: 2,
          }}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {products?.list?.map((product) => {
            const { formattedPrice } = priceFormatter(
              product.price,
              product.sale_price
            );
            return (
              <div
                key={product.id}
                className="w-full mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group"
              >
                <div className="relative aspect-square">
                  <img
                    src={product.avatar_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-white" />
                        <h3 className="font-medium text-white truncate">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-sm text-white/80">
                        {product.category?.name || "Chưa phân loại"}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => {
                        setProduct(product);
                        setIsOpen(true);
                      }}
                      className="bg-white/90 text-gray-800 px-3 py-1.5 rounded-lg hover:bg-white transition-colors text-sm font-medium shadow-sm"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <h3 className="font-medium text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500">
                        {product.category?.name || "Chưa phân loại"}
                      </div>
                      <div className="text-primary font-medium">
                        {formattedPrice}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500">
                        {product?.skus?.length || 0} biến thể
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Masonry>
      </div>
    </div>
  );
}
