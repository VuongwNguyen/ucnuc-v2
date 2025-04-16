import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { fetchCategory, createProduct, updateProduct } from "../../store/api";
import {useDispatch, useSelector} from "react-redux"
import { toast } from "react-toastify";
import { X, Upload, Plus, Minus } from "lucide-react";

function CreateNewProduct({ onClose, isOpen, product }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const [formData, setFormData] = useState({
    image: null,
    avatar_url: "",
    name: "",
    description: "",
    price: 0,
    discount: 0,
    category: "",
    flavor: "",
    skus: [],
  });

  // Đồng bộ state với prop product khi product thay đổi
  useEffect(() => {
    if (product) {
      setFormData({
        image: null,
        avatar_url: product.avatar_url || "",
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        discount: product.sale_price || 0,
        category: product?.category?.id || "",
        flavor: product.type || "",
        skus: product.skus || [],
      });
    } else {
      // Reset form khi không có product
      setFormData({
        image: null,
        avatar_url: "",
        name: "",
        description: "",
        price: 0,
        discount: 0,
        category: "",
        flavor: "",
        skus: [],
      });
    }
  }, [product, isOpen]); // Thêm isOpen vào dependencies

  async function valid() {
    if (!formData.name) return toast.warn("Vui lòng nhập tên sản phẩm!");
    if (!formData.image && !formData.avatar_url)
      return toast.warning("Vui lòng chọn ảnh");
    if (!formData.price) return toast.warn("Vui lòng nhập giá sản phẩm!");
    if (!formData.category)
      return toast.warn("Vui lòng chọn danh mục sản phẩm!");
    if (!formData.flavor) return toast.warn("Vui lòng chọn kiểu sản phẩm!");

    for (const sku of formData.skus) {
      if (!sku.name) return toast.warn("Vui lòng nhập tên SKU!");
      if (!sku.price) return toast.warn("Vui lòng nhập giá SKU!");
      if (!sku.sku) return toast.warn("Vui lòng nhập SKU!");
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valid()) return;

    const action = product ? updateProduct : createProduct;
    const successMessage = product
      ? "Cập nhật sản phẩm thành công!"
      : "Tạo sản phẩm thành công!";
    const pendingMessage = product
      ? "Đang cập nhật sản phẩm..."
      : "Đang tạo sản phẩm...";
    const errorMessage = product
      ? "Cập nhật sản phẩm thất bại!"
      : "Tạo sản phẩm thất bại!";

    const productData = {
      ...(product && { id: product.id }),
      name: formData.name,
      description: formData.description,
      image: formData.image,
      price: formData.price,
      discount: formData.discount,
      category_id: formData.category,
      flavor: formData.flavor,
      skus: formData.skus,
    };

    toast.promise(
      dispatch(action(productData)),
      {
        pending: pendingMessage,
        success: successMessage,
        error: errorMessage,
      }
    );
  }

  useEffect(() => {
   dispatch(fetchCategory())
  }, []);

  const handleSkuChange = (index, field, value) => {
    const newSkus = [...formData.skus];
    newSkus[index] = { ...newSkus[index], [field]: value };
    setFormData({ ...formData, skus: newSkus });
  };

  const addSku = () => {
    setFormData({
      ...formData,
      skus: [...formData.skus, { name: "", price: 0, sale_price: 0, sku: "" }],
    });
  };

  const removeSku = (index) => {
    const newSkus = [...formData.skus];
    newSkus.splice(index, 1);
    setFormData({ ...formData, skus: newSkus });
  };

  return (
    <Portal onClose={onClose} isOpen={isOpen}>
      <div className="bg-white rounded-lg w-full">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {product ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            {/* Upload ảnh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh sản phẩm
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                <label htmlFor="file-upload" className="w-full cursor-pointer">
                  <div className="space-y-2 text-center">
                    {formData.image || formData.avatar_url ? (
                      <img
                        src={
                          formData.image
                            ? URL.createObjectURL(formData.image)
                            : formData.avatar_url
                        }
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                        alt="Preview"
                      />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="text-blue-500 font-medium">
                        Tải ảnh lên
                      </span>
                      <span className="pl-1">hoặc kéo thả</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>

            {/* Giá và giảm giá */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá
                </label>
                <input
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập giá"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá giảm
                </label>
                <input
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập giá giảm"
                />
              </div>
            </div>

            {/* Kiểu sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kiểu sản phẩm
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.flavor === "sweet"}
                    onChange={() =>
                      setFormData({ ...formData, flavor: "sweet" })
                    }
                    className="w-4 h-4 text-blue-500"
                  />
                  <span>Ngọt</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.flavor === "savory"}
                    onChange={() =>
                      setFormData({ ...formData, flavor: "savory" })
                    }
                    className="w-4 h-4 text-blue-500"
                  />
                  <span>Mặn</span>
                </label>
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories?.list?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SKUs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Danh sách SKU
                </label>
                <button
                  type="button"
                  onClick={addSku}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm SKU</span>
                </button>
              </div>

              {formData.skus.map((sku, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-700">
                      SKU #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeSku(index)}
                      className="p-1 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      value={sku.name}
                      onChange={(e) =>
                        handleSkuChange(index, "name", e.target.value)
                      }
                      placeholder="Tên SKU"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      value={sku.sku}
                      onChange={(e) =>
                        handleSkuChange(index, "sku", e.target.value)
                      }
                      placeholder="Mã SKU"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      value={sku.price}
                      onChange={(e) =>
                        handleSkuChange(index, "price", e.target.value)
                      }
                      type="number"
                      min="0"
                      placeholder="Giá"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      value={sku.sale_price}
                      onChange={(e) =>
                        handleSkuChange(index, "sale_price", e.target.value)
                      }
                      type="number"
                      min="0"
                      placeholder="Giá khuyến mãi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {product ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}

export default CreateNewProduct;
