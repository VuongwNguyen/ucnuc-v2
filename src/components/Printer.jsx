import { PrinterIcon } from "lucide-react";
import React from "react";
import { priceFormatter } from "../util/priceFormatter";

export default function Printer({ order }) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    const html = `
    <!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hóa Đơn #${order.id}</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 5px;
            font-size: 10px;
            line-height: 1.2;
            background: #fff;
        }
        .title {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
        }
        .info {
            margin-bottom: 5px;
            text-align: center;
        }
        .info div {
            margin-bottom: 2px;
        }
        .item {
            border-top: 1px dashed #000;
            padding: 3px 0;
        }
        .item-name {
            font-weight: bold;
            font-size: 10px;
        }
        .item-details {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
        }
        .topping-list {
            margin-top: 2px;
            padding-top: 2px;
            border-top: 1px dashed #ccc;
            font-size: 9px;
            color: #555;
        }
        .topping-list li {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1px;
        }
        .total {
            border-top: 1px solid #000;
            margin-top: 5px;
            padding-top: 3px;
            font-weight: bold;
            text-align: right;
            font-size: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 5px;
            font-size: 9px;
            border-top: 1px dashed #000;
            padding-top: 3px;
        }
        @media print {
            body {
                padding: 0;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="title">HÓA ĐƠN #${order.id}</div>

    <!-- Thông tin cửa hàng -->
    <div class="info">
        <div>Úc Núc - Uống là ghiền, Ăn là no</div>
        <div>70 Phạm Tung, KP.1, F3, TP.Tây Ninh</div>
        <div>Tel: 0123 456 789</div>
    </div>

    <!-- Thông tin đơn hàng -->
    <div class="info">
        <div>Vị trí: ${order.table_name}</div>
        <div>Thời gian: ${new Date(order.createdAt).toLocaleString(
          "vi-VN"
        )}</div>
        <div>Phương thức: ${
          {
            cash: "Tiền mặt",
            card: "Thẻ",
          }[order.payment_method] || "Không xác định"
        }</div>
    </div>

    <!-- Chi tiết sản phẩm -->
    ${order.orderDetails
      .map(
        (item) => `
        <div class="item">
            <div class="item-name">${item.product_name}</div>
            ${
              item.toppingDetails && item.toppingDetails.length > 0
                ? `
                <div class="topping-list">
                    <ul>
                        ${item.toppingDetails
                          .map(
                            (topping) => `
                            <li>
                                <span>${topping.name_topping} x${
                              topping.quantity
                            }</span>
                                <span>${priceFormatter(
                                  topping.price * topping.quantity
                                ).formattedPrice}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
            `
                : ""
            }
            <div class="item-details">
                <span>${item.quantity} x ${priceFormatter(item.price).formattedPrice}</span>
                <span>${priceFormatter(item.quantity * item.price).formattedPrice}</span>
            </div>
        </div>
    `
      )
      .join("")}

    <!-- Tổng cộng -->
    <div class="total">Tổng cộng: ${priceFormatter(order.total).formattedPrice} </div>

    <!-- Chân trang -->
    <div class="footer">
        <div>Cảm ơn quý khách!</div>
       
    </div>

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
