import React from "react";
import Portal from "./Portal";
import { Plus } from "lucide-react";
export default function ManageTopping() {
  return (
    <Portal>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản lí món thêm
          </h1>
        </div>
        <div className="flex justify-end">
          <Button>
            <Plus className="w-4 h-4" />
            Thêm món thêm
          </Button>
          <Button>
          </Button>
        </div>
      </div>
    </Portal>
  );
}
