import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ComponentToPrint = React.forwardRef((props, ref) => (
  <div ref={ref} className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto mt-4">
    <h1 className="text-2xl font-bold mb-2">Hóa đơn</h1>
    <p className="text-lg">Sản phẩm: Cà phê</p>
  </div>
));

const Testing = () => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "HoaDon",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ComponentToPrint ref={componentRef} />
      <button
        onClick={handlePrint}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        In hóa đơn
      </button>
    </div>
  );
};

export default Testing;