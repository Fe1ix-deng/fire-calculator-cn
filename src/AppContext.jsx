import { createContext, useCallback, useContext, useState } from "react";

const AppContext = createContext({
  sharedData: {},
  updateData: () => {},
  clearData: () => {},
});

export function AppProvider({ children }) {
  const [sharedData, setSharedData] = useState(() => {
    try {
      const saved = localStorage.getItem("fire-data");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const updateData = useCallback((newData) => {
    setSharedData((current) => {
      const merged = { ...current, ...newData };
      localStorage.setItem("fire-data", JSON.stringify(merged));
      return merged;
    });
  }, []);

  const clearData = useCallback(() => {
    setSharedData({});
    localStorage.removeItem("fire-data");
  }, []);

  return (
    <AppContext.Provider value={{ sharedData, updateData, clearData }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppData = () => useContext(AppContext);
