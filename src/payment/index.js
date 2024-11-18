import CryptoJS from "crypto-js";
import AxiosInstance from "../hooks/AxiosInstance";

const checksumKey = import.meta.env.VITE_PAYOS_CHECKSUM_KEY;
const baseUrl = "http://localhost:5173/";
const cancelUrl = `${baseUrl}checkout`;
const returnUrl = `${baseUrl}checkout`;

function generateSignature(data, checksumKey) {
  const sortedKeys = Object.keys(data).sort();
  const dataString = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");

  return CryptoJS.HmacSHA256(dataString, checksumKey).toString(
    CryptoJS.enc.Hex
  );
}

export default function payment({ amount, orderCode, description }) {
  const data = {
    orderCode,
    amount,
    description,
    cancelUrl,
    returnUrl,
  };
  console.log("data>>>", data);

  const signature = generateSignature(data, checksumKey);

  const payload = {
    ...data,
    signature,
  };

  console.log("payload>>>", payload);

  return AxiosInstance().post("payment-requests", payload);
}
