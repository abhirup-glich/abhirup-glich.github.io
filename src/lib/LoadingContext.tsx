import { createContext, useContext, useState, type ReactNode } from "react";

export type LoadingState = "loading" | "exiting" | "hero-entering" | "hero-ready" | "complete";

interface LoadingContextType {
  state: LoadingState;
  setState: (state: LoadingState) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LoadingState>("loading");

  return (
    <LoadingContext.Provider value={{ state, setState }}>
      {children}
    </LoadingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
