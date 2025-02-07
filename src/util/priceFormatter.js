export const priceFormatter = (price, discount) => {
  let finalPrice = price;
  if (discount) finalPrice = price - discount;
  return {
    formattedPrice: new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(finalPrice),
    finalPrice,
  };
};
