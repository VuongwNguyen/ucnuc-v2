import CryptoJS from "crypto-js";
import AxiosInstance from "../hooks/AxiosInstance";

const checksumKey = import.meta.env.VITE_PAYOS_CHECKSUM_KEY;
const baseUrl = import.meta.env.VITE_PAYOS_BASE_URL;
const cancelUrl = `${baseUrl}checkout`;
const returnUrl = `${baseUrl}checkout`;

function generateSignature(data, checksumKey) {
  const sortedKeys = Object.keys(data).sort();
  const dataString = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");

  return CryptoJS.HmacSHA256(dataString, checksumKey).toString(
    CryptoJS.enc.Hex
  );
}

const randomOrderCode = () => Math.floor(Math.random() * 9007199254740991);

export default async function payment({ amount, description }) {
  const data = {
    orderCode: randomOrderCode(),
    amount,
    description,
    cancelUrl,
    returnUrl,
  };

  const signature = generateSignature(data, checksumKey);

  const payload = {
    ...data,
    signature,
  };

  try {
    const res = await AxiosInstance().post("payment-requests", payload);
    if (res.code !== "00") {
      throw new Error("Error creating payment request");
    }
    return res;
  } catch (error) {
    console.error("Error creating payment request:", error);
    throw error;
  }
}
