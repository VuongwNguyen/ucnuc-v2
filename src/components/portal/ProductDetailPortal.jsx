import React, { useState } from "react";
import Portal from "./Portal";
import { MinusCircle, PlusCircle } from "lucide-react";
import Product from "./../../dao/model/Product";
import { useCart } from "./../../context/UcnucContext";

export default function ProductDetailPortal({
  isOpen,
  onClose,
  productDetail,
}) {
  const { state, dispatch } = useCart();
  const [selectedOption, setSelectedOption] = useState(
    productDetail?.option ? productDetail.option[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  // Check if productDetail or its options are missing
  if (!productDetail || !productDetail.option) {
    return null; // Return null or handle empty state gracefully
  }

  const handleOptionChange = (e) => {
    const selectedId = e.target.value;
    const option = productDetail.option.find((opt) => opt.id === selectedId);
    setSelectedOption(option);
  };

  function handleQuantityChange(type) {
    if (type === "inc") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  }

  function handleAddToCart() {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: selectedOption.id,
        name: selectedOption.name,
        price: selectedOption.price - productDetail.discount,
        image: productDetail.image,
        quantity,
        note,
      },
    });
    onClose();
  }

  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="h-fit bg-[#e9eaec] p-2 items-center flex flex-row flex-1 justify-center rounded-lg">
          <img
            src={productDetail?.image}
            alt={productDetail?.name}
            className="w-60 h-48 object-cover self-center rounded-xl"
          />
        </div>
        <div className="flex flex-col flex-1 mx-2">
          <div className="flex flex-1 flex-row justify-between items-center">
            <h1 className="text-2xl font-semibold truncate">
              {selectedOption?.name}
            </h1>
            <div className="items-center flex gap-2">
              {productDetail.discount && (
                <span className="line-through text-red-500 text-sm">
                  {Product.priceFormatter(selectedOption.price)}
                </span>
              )}

              <h3>
                {Product.priceFormatter(
                  selectedOption.price,
                  productDetail.discount
                )}
              </h3>
            </div>
          </div>

          {productDetail.option?.length === 1 || (
            <select
              name="opt"
              id="opt"
              className="border border-gray-300 p-2 rounded-lg"
              onChange={handleOptionChange}
              value={selectedOption?.id || ""}
            >
              {productDetail.option.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          )}
          {/* quantity */}
          <div className="flex items-center mx-auto">
            <button
              className="border border-gray-300 p-2 rounded-lg"
              onClick={() => handleQuantityChange("dec")}
            >
              <MinusCircle />
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              className="border border-gray-300 p-2 rounded-lg"
              onClick={() => handleQuantityChange("inc")}
            >
              <PlusCircle />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Ghi chú</h3>
            <textarea
              placeholder="Hãy để lại lời nhắn cho chúng tôi, bất cứ điều gì bạn muốn ví dụ: ít đá, không đường, thêm sữa,..."
              className="border border-gray-300 p-2 rounded-lg w-full"
              rows="4"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-row justify-between mt-4 gap-3">
        <span>Tạm tính:</span>
        <span className="font-semibold">
          {Product.priceFormatter(
            selectedOption.price * quantity,
            productDetail.discount * quantity
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-row justify-between mt-4 gap-3">
        <button
          className="bg-secondary text-white p-2 rounded-lg flex flex-1 justify-center"
          onClick={onClose}
        >
          Huỷ
        </button>
        <button
          className="bg-primary text-white p-2 rounded-lg flex flex-1 justify-center"
          onClick={handleAddToCart}
        >
          Thêm giỏ hàng
        </button>
      </div>
    </Portal>
  );
}
