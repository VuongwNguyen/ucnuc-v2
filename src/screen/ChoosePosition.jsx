import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Table from "../dao/model/Table";

export default function ChoosePosition() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await Table.read((tables) => {
        setTables(tables);
      });
    }
    fetchData();
  }, []);
  return (
    <div className="flex flex-1 container flex-col">
      {/* header */}
      <div className="flex flex-1 flex-row">
        <h1 className="text-3xl font-bold">Uc Nuc</h1>
        <p className="text-lg">Choose your position</p>
      </div>

      {tables.map((table) => (
        <div
          key={table.id}
          className={`border border-gray-300 p-2 m-2 rounded-md justify-center items-center flex flex-col ${
            table.customer_id ? "bg-red-100" : "bg-green-100"
          }`}
        >
          <span>{table.name}</span>
          <span>
            {table.customer_id ? (
              <span className="text-red-500">Occupied</span>
            ) : (
              <span className="text-green-500">Available</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
