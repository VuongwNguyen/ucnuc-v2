import { Search, ShoppingCart } from "lucide-react";
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
    if (debouncedSearchTerm) {
      dispatch(fetchProducts({ page: 1, limit: 1000, keyword: debouncedSearchTerm }));
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (cateSelected || cateSelected === 0) {
      dispatch(fetchProducts({ page: 1, limit: 1000, category_id: cateSelected }));
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
  // loading
  if (tableArea.loading)
    return (
      <Loading message="Hệ thống đang khởi động, vui lòng đợi trong giây lát..." />
    );

  return (
    <div className="bg-white">
      {/* dialog product detail */}
      {showDetail && (
        <ProductDetailPortal
          productDetail={productDetail}
          onClose={() => setShowDetail(false)}
          isOpen={showDetail}
        />
      )}
      {/* dialog cart */}
      {showCart && (
        <CartPortal onClose={() => setShowCart(false)} isOpen={showCart} />
      )}
      {/* Header */}
      <div className="flex flex-1 flex-row justify-between container mt-2 items-center relative">
        <h1 className="text-black truncate">Úc Núc</h1>
        <button
          className="flex items-center justify-center w-12 h-12 p-3 bg-secondary text-white rounded-xl"
          onClick={() => setShowCart(true)}
        >
          <ShoppingCart color="white" />
          <span className="absolute top-0 right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            {product.cart.cartLength}
          </span>
        </button>
      </div>
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
      {product.loading || category.loading ? (
        <Loading message="Đang tải dữ liệu..." />
      ) : (
        <div>
          {/* Categories */}
          <div className="container mt-2">
          <h2 className="text-black">Danh mục</h2>
          <div className="flex flex-1 flex-row overflow-y-auto">
            {category?.categories?.list?.map((cate) => (
              <CardCategory
                cate={cate}
                key={cate.id}
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
                default: 6, // Mặc định 4 cột cho desktop
                1300: 4, // 4
                1100: 3, // 3 cột cho màn hình từ 1100px (tablet)
                700: 2, // 2 cột cho màn hình từ 700px (mobile)
              }} // Cấu hình số cột
              className="flex flex-wrap" // Khoảng cách giữa các item
              columnClassName="flex flex-col items-center" // Lớp cho mỗi cột
            >
              {/* Map qua dữ liệu sản phẩm */}
              {product?.products?.list?.map((product) => {
                return (
                  <CardProduct
                    key={product.id}
                    product={product}
                    onClick={() => handle(product)}
                  />
                );
              })}
            </Masonry>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
