import { Search, ShoppingCart, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Masonry from "react-masonry-css";
import CardProduct from "../components/present/CardProduct";
import CardCategory from "../components/present/CardCategory";
import ProductDetailPortal from "./../components/portal/ProductDetailPortal";
import CartPortal from "../components/portal/CartPortal";
import { findTable, fetchProducts, fetchCategory } from "../store/api";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/present/Loading";

export default function Home() {
  const product = useSelector((state) => state.product);
  const category = useSelector((state) => state.category);
  const tableArea = useSelector((state) => state.tableArea);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [cateSelected, setCateSelected] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const { table_id } = useParams();
  const navigate = useNavigate();

  function handle(product) {
    setProductDetail(product);
    setShowDetail(true);
  }

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        limit: 1000,
        keyword: debouncedSearchTerm,
        category_id: cateSelected,
      })
    );
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (cateSelected || cateSelected === 0) {
      dispatch(
        fetchProducts({ page: 1, limit: 1000, category_id: cateSelected })
      );
    }
  }, [cateSelected]);

  useEffect(() => {
    if (table_id) {
      dispatch(findTable(table_id))
        .unwrap()
        .then((res) => {
          dispatch(fetchProducts({ page: 1, limit: 10 }));
          dispatch(fetchCategory({ page: 1, limit: 1000 }));
        })
        .catch((err) => {
          navigate("/");
        });
    }
  }, []);

  if (tableArea.loading) {
    return (
      <Loading message="Hệ thống đang khởi động, vui lòng đợi trong giây lát..." />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {showDetail && (
        <ProductDetailPortal
          productDetail={productDetail}
          onClose={() => setShowDetail(false)}
          isOpen={showDetail}
        />
      )}
      {showCart && (
        <CartPortal onClose={() => setShowCart(false)} isOpen={showCart} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto">
          <nav className="h-14 px-3 flex items-center gap-3">
            <img
              src={"./images/logo.jpg"}
              alt="logo"
              className="w-10 h-10 object-scale-down"
            />
            <div className="text-base font-semibold text-gray-800">Úc Núc</div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-gray-300"
                />
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
              </div>
            </div>

            <button
              className="relative ml-auto p-1.5 hover:bg-black/5 rounded-lg text-gray-700"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={20} />
              {product.cart.cartLength > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {product.cart.cartLength}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-gray-300"
            />
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
          </div>
        </div>

        {/* Categories */}
        {category.loading ? (
          <Loading message="Đang tải dữ liệu..." />
        ) : (
          <section
            className="bg-white rounded-2xl py-3 px-4 shadow-sm mb-6"
            style={{ msOverflowStyle: "none" }}
        >
          <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {category?.categories?.list?.map((cate) => (
              <CardCategory
                key={cate.id}
                cate={cate}
                cateSelected={cateSelected}
                onClick={() => setCateSelected(cate.id)}
              />
            ))}
          </div>
          </section>
        )}

        {product.loading ? (
          <Loading message="Đang tải dữ liệu..." />
        ) : (
            <section>
              {/* Products Grid */}
              <Masonry
                breakpointCols={{
                  default: 5,
                  1600: 4,
                  1200: 3,
                  900: 2,
                  500: 1,
                }}
                className="flex -ml-4 -mr-4 w-auto"
                columnClassName="pl-4 pr-4 bg-clip-padding"
              >
                {product?.products?.list?.map((product) => (
                  <CardProduct
                    key={product.id}
                    product={product}
                    onClick={() => handle(product)}
                  />
                ))}
              </Masonry>
            </section>
        )}
      </main>
    </div>
  );
}
