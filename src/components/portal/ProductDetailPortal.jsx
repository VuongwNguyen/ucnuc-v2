import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { MinusCircle, PlusCircle } from "lucide-react";
import { priceFormatter } from "../../util/priceFormatter";
import { getTopping } from "../../api/Product.api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices";

export default function ProductDetailPortal({
  isOpen,
  onClose,
  productDetail,
}) {
  if (!productDetail) {
    return null;
  }
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.product);
  const [skus, setSkus] = useState([
    {
      id: 0,
      name: "Mặc định",
      price: productDetail.price,
      sale_price: productDetail.sale_price,
      sku: null,
    },
    ...productDetail.skus,
  ]);
  const [selectedSku, setSelectedSku] = useState(skus[0]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);

  function handleQuantityChange(type) {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  }

  useEffect(() => {
    async function fetchToppings() {
      await getTopping({ type: productDetail.type }, (toppings) => {
        setToppings(toppings);
      });
    }

    fetchToppings();
  }, []);

  const priceTopping = selectedToppings.reduce(
    (sum, topping) => parseInt(topping.price) + sum,
    0
  );

  const tempPrice = selectedSku.price * quantity + priceTopping;

  function handleAddToCart() {
    const toppingsWithNote = note 
      ? [...selectedToppings, { 
          id: 'note', 
          name: note, 
          price: 0, 
          sku: note.replace(/ /g, '-')
        }]
      : selectedToppings;

    dispatch(addToCart({
      name:
          productDetail.name +
          `${selectedSku.name === "Mặc định" ? "" : " - " + selectedSku.sku}`,
        quantity,
        price: selectedSku.price - selectedSku.sale_price,
        toppings: toppingsWithNote,
        avatar_url: productDetail.avatar_url,
        note: note
      })
    );
    onClose();
  }

  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {/* Product Image */}
          <div className="p-6">
            <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={productDetail?.avatar_url}
                alt={productDetail?.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="px-6 space-y-6">
            {/* Title and Price */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {productDetail.name}
                </h1>
                {selectedSku.name !== "Mặc định" && (
                  <p className="text-sm text-gray-500 mt-1">{selectedSku.name}</p>
                )}
              </div>
              <div className="text-right">
                {selectedSku.sale_price > 0 && (
                  <span className="line-through text-sm text-gray-400 block">
                    {priceFormatter(selectedSku.price).formattedPrice}
                  </span>
                )}
                <span className="text-xl font-semibold text-primary">
                  {priceFormatter(selectedSku.price, selectedSku.sale_price).formattedPrice}
                </span>
              </div>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Số lượng</span>
              <div className="flex items-center gap-3">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => handleQuantityChange("decrease")}
                >
                  <MinusCircle className="w-5 h-5 text-gray-600" />
                </button>
                <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => handleQuantityChange("increase")}
                >
                  <PlusCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* SKU Selection */}
            {skus.length > 1 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Chọn phiên bản</label>
                <select
                  name="sku"
                  id="sku"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  onChange={(e) => {
                    setSelectedSku(
                      skus.find((sku) => sku.id === parseInt(e.target.value))
                    );
                  }}
                  value={selectedSku?.id || ""}
                >
                  {skus.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {sku.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Toppings */}
            {toppings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Món thêm</h3>
                <div className="space-y-2">
                  {toppings.map((topping) => (
                    <label
                      key={topping.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          checked={selectedToppings.some(t => t.id === topping.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedToppings([...selectedToppings, topping]);
                            } else {
                              setSelectedToppings(
                                selectedToppings.filter((item) => item.id !== topping.id)
                              );
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{topping.name}</span>
                      </div>
                      <span className="text-sm font-medium text-primary">
                        +{priceFormatter(topping.price).formattedPrice}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
              <textarea
                placeholder="Hãy để lại lời nhắn cho chúng tôi, bất cứ điều gì bạn muốn ví dụ: ít đá, không đường, thêm sữa,..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Tạm tính</span>
            <span className="text-xl font-semibold text-primary">
              {priceFormatter(tempPrice, selectedSku.sale_price * quantity).formattedPrice}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Huỷ
            </button>
            <button
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              onClick={handleAddToCart}
            >
              Thêm giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
