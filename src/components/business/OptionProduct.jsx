import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format"; // Import đúng từ react-number-format

function OptionProduct({ options, setOptions, index }) {
  const [displayPrice, setDisplayPrice] = useState(options[index].price || "");

  useEffect(() => {
    setDisplayPrice(options[index].price || "");
  }, [options, index]);

  return (
    <div className="flex flex-col md:flex-row gap-3 border-b-2 pb-3 border-b-black">
      <div className="flex flex-col flex-1">
        <label htmlFor="price">Tên sản phẩm {index + 1}</label>
        <input
          type="text"
          onChange={(e) => {
            setOptions((prev) => {
              let newOptions = [...prev];
              newOptions[index].name = e.target.value;
              return newOptions;
            });
          }}
          value={options[index].name}
          className="border border-gray-300 p-2 rounded-lg"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label htmlFor="price">Giá Gốc {index + 1}</label>
        <NumericFormat
          value={displayPrice}
          onValueChange={(values) => {
            const { value } = values;
            setDisplayPrice(value);
            setOptions((prev) => {
              let newOptions = [...prev];
              newOptions[index].price = value.replace(/[^0-9]/g, ""); // Lưu giá trị thô vào options
              return newOptions;
            });
          }}
          thousandSeparator=","
          suffix=" ₫"
          className="border border-gray-300 p-2 rounded-lg"
        />
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          if (options.length === 1)
            return toast.error("Đây sẽ là tên và giá gốc của sản phẩm");
          let newOptions = [...options];
          newOptions.splice(index, 1);
          setOptions(newOptions);
          toast.success("Đã xóa 1 option");
        }}
        className="bg-red-500 text-white p-2 rounded-lg"
      >
        Xóa
      </button>
    </div>
  );
}

export default memo(OptionProduct);
