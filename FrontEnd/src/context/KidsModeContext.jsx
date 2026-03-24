import React, { createContext, useContext, useState, useEffect } from "react";

const KidsModeContext = createContext();

export const KidsModeProvider = ({ children }) => {
  // Lưu trạng thái vào LocalStorage để khi F5 không bị mất
  const [isKidsMode, setIsKidsMode] = useState(() => {
    return localStorage.getItem("kidsMode") === "true";
  });

  const toggleKidsMode = () => {
    setIsKidsMode((prev) => {
      const newState = !prev;
      localStorage.setItem("kidsMode", newState);
      return newState;
    });
  };

  return (
    <KidsModeContext.Provider value={{ isKidsMode, toggleKidsMode }}>
      {children}
    </KidsModeContext.Provider>
  );
};

export const useKidsMode = () => useContext(KidsModeContext);
