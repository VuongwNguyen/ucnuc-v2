import { PrinterIcon } from "lucide-react";
import React from "react";

export default function Printer({ order }) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    const html = `
    <html>
  <head>
    <title>Hóa đơn #${order.id}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        padding: 10px;

      }

      .title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
      }

      .info {
        margin-bottom: 10px;
      }

      .info div {
        margin-bottom: 2px;
      }

      .item {
        border-top: 1px dashed #000;
        padding: 5px 0;
      }

      .item-name {
        font-weight: bold;
      }

      .item-details {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
      }

      .total {
        border-top: 1px solid #000;
        margin-top: 10px;
        padding-top: 5px;
        font-weight: bold;
        text-align: right;
      }

      .footer {
        text-align: center;
        margin-top: 15px;
        font-size: 11px;
      }
    </style>
  </head>
  <body>
    <div class="title">HÓA ĐƠN #${order.id}</div>

    <div class="info">
      <div>Vị trí: ${order.table_name}</div>
      <div>Thời gian: ${new Date(order.createdAt).toLocaleString()}</div>
      <div>Phương thức: ${
        {
          cash: "Tiền mặt",
          card: "Thẻ",
        }[order.payment_method]
      }</div>
    </div>

    ${order.orderDetails
      .map(
        (item) => `
      <div class="item">
        <div class="item-name">${item.product_name}</div>
        <div class="item-details">
          <span>${item.quantity} x ${item.price}</span>
          <span>${item.quantity * item.price}</span>
        </div>
      </div>
    `
      )
      .join("")}

    <div class="total">Tổng cộng: ${order.total}</div>

    <div class="footer">Cảm ơn quý khách!</div>

    <script>
      setTimeout(() => {
        window.print();
        window.close();
      }, 500);
    </script>
  </body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <>
      <button
        onClick={handlePrint}
        className=" bg-blue-500 text-white rounded hover:bg-blue-600 p-2"
      >
        <PrinterIcon className="w-5 h-5" />
      </button>
    </>
  );
}
