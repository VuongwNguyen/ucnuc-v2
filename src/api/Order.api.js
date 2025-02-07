import AxiosInstance from "../hooks/AxiosInstance";

export const createOrder = async (
  {
    table_name = "",
    payment_method = "",
    order_type = "",
    total = 0,
    order_details = [],
  },
  callback
) => {
  const order = await AxiosInstance().post("/order/create", {
    table_name,
    payment_method,
    order_type,
    total,
    order_details,
  });

  callback(order.meta);
};

export const getOrdersByID = async (order_id, callback) => {
  const orders = await AxiosInstance().post(`/order/getOrdersByID/`, {
    order_id,
  });
  callback(orders.meta);
};

export const updateOrderStatus = async ({ order_id, status }) => {
  const order = await AxiosInstance().put(`/order/updateOrderStatus`, {
    order_id,
    status,
  });

  return order.statusResponse;
};

export const updatePaymentStatus = async ({ order_id, payment_status, ref_pay }) => {
  const order = await AxiosInstance().put(`/order/updatePaymentStatus`, {
    order_id,
    payment_status,
    ref_pay,
  });

  return order.statusResponse;
};
