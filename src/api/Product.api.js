import AxiosInstance from "../hooks/AxiosInstance";

export const getProducts = async (
  { limit = 1, page = 10, category_id = null, keyword = "" },
  callback
) => {
  const products = await AxiosInstance().get(
    `/product/product?limit=${limit}&page=${page && page}&category_id=${
      category_id && category_id
    }&keyword=${keyword && keyword}`
  );

  callback(products.meta);
};

export const getTopping = async ({ type }, callback) => {
  const toppings = await AxiosInstance().get(`/product/topping?type=${type}`);

  callback(toppings.meta);
};
