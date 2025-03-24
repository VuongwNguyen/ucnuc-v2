import React from "react";
import { motion } from "framer-motion";

const Loading = ({message}) => {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <motion.span
        className="mt-4 text-lg font-medium text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        {message}
      </motion.span>
    </div>
  );
};

export default Loading;
