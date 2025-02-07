import React, { createContext, useContext, useState } from "react";

const authContext = createContext();

export default function ProvideAuthAdmin({ children }) {
  const [admin, setAdmin] = useState(false);
  return (
    <authContext.Provider value={{ admin, setAdmin }}>
      {children}
    </authContext.Provider>
  );
}

export function useAuthAdminContext() {
  return useContext(authContext);
}
