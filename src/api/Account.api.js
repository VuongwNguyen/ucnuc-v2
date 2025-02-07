import AxiosInstance from "../hooks/AxiosInstance";

export const login = async ({ email, password, admin = false }, callback) => {
  const account = await AxiosInstance().post(`/account/login`, {
    email,
    password,
    admin,
  });
  localStorage.setItem("account", JSON.stringify(account.meta));
  callback(account.meta);
};
