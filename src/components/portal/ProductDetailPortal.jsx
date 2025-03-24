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
  console.log(cart);
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
    dispatch(addToCart({
      name:
          productDetail.name +
          `${selectedSku.name === "Mặc định" ? "" : " - " + selectedSku.sku}`,
        quantity,
        price: selectedSku.price - selectedSku.sale_price,
        toppings: selectedToppings,
        avatar_url: productDetail.avatar_url,
      })
    );
    onClose();
  }

  return (
    <Portal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="h-fit bg-[#e9eaec] p-2 items-center flex flex-row flex-1 justify-center rounded-lg">
          <img
            src={productDetail?.avatar_url}
            alt={productDetail?.name}
            className="w-60 h-48 object-cover self-center rounded-xl"
          />
        </div>
        <div className="flex flex-col flex-1 mx-2">
          <div className="flex flex-1 flex-row justify-between items-center">
            <h1 className="text-2xl font-semibold truncate">
              {`${productDetail.name}${
                selectedSku.name === "Mặc định" ? "" : " - " + selectedSku.name
              }`}
            </h1>
            <div className="items-center flex gap-2">
              {selectedSku.sale_price && (
                <span className="line-through text-red-500 text-sm">
                  {priceFormatter(selectedSku.price).formattedPrice}
                </span>
              )}
              <h3>
                {
                  priceFormatter(selectedSku.price, selectedSku.sale_price)
                    .formattedPrice
                }
              </h3>
            </div>
          </div>
          <div className="flex items-center mx-auto">
            <button
              className="border border-gray-300 p-2 rounded-lg"
              onClick={() => handleQuantityChange("decrease")}
            >
              <MinusCircle />
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              className="border border-gray-300 p-2 rounded-lg"
              onClick={() => handleQuantityChange("increase")}
            >
              <PlusCircle />
            </button>
          </div>
          {skus.length === 1 || (
            <select
              name="sku"
              id="sku"
              className="border border-gray-300 p-2 rounded-lg m-2"
              onChange={() => {
                setSelectedSku(
                  skus.find((sku) => sku.id === parseInt(event.target.value))
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
          )}
          <h3 className="text-lg font-semibold">Món thêm</h3>
          {/* quantity */}
          {toppings?.map((topping) => (
            // checkbox
            <div
              key={topping.id}
              className="flex flex-1 flex-row justify-between mx-3 my-1"
            >
              <label className="text-lg font-semibold" htmlFor={topping.id}>
                {topping.name} +{priceFormatter(topping.price).formattedPrice}
              </label>
              <input
                className="size-6 border "
                type="checkbox"
                value={topping.id}
                id={topping.id}
                name={topping.name}
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
            </div>
          ))}
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
          {
            priceFormatter(tempPrice, selectedSku.sale_price * quantity)
              .formattedPrice
          }
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
          onClick={() => handleAddToCart()}
        >
          Thêm giỏ hàng
        </button>
      </div>
    </Portal>
  );
}
