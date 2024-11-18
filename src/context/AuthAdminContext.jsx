import React, { createContext, useContext, useState } from "react";

const authContext = createContext();

export default function ProvideAuth({ children }) {
  const [admin, setAdmin] = useState(null);
  return (
    <authContext.Provider value={{ admin, setAdmin }}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}
