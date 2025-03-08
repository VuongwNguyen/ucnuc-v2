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

export const createProduct = async (
  { name, description, image, price, discount, category_id, flavor, skus },
  callback
) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image);
  formData.append("price", price);
  formData.append("sale_price", discount);
  formData.append("category_id", category_id);
  formData.append("type", flavor);
  formData.append("skus", skus);

  const product = await AxiosInstance("multipart/form-data").post(
    `/product/product`,
    formData
  );

  callback(product.message);
};
