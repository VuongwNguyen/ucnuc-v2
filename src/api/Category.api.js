import AxiosInstance from "../hooks/AxiosInstance";

export const getCategories = async ({ limit = 10, page = 1 }, callback) => {
  const categories = await AxiosInstance().get(
    `/category/category?limit=${limit}&page=${page && page}`
  );
  callback(categories.meta);
};

export const createCategory = async (
  { name, description, image },
  callback
) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", {
    uri: image?.uri,
    type: image?.type,
    name: image?.name,
  });

  const category = await AxiosInstance("multipart/form-data").post(
    `/category/category`,
    formData
  );

  callback(category.meta);
};
