import AxiosInstance from "../hooks/AxiosInstance";

export const getCategories = async ({ limit = 1, page = 10 }, callback) => {
  const categories = await AxiosInstance().get(
    `/category/category?limit=${limit}&page=${page && page}`
  );
  callback(categories.meta);
};
