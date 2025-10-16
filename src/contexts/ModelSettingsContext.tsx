"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ModelSettingsContextType {
  provider: string;
  setProvider: (provider: string) => void;
  model: string;
  setModel: (model: string) => void;
}

const ModelSettingsContext = createContext<ModelSettingsContextType | undefined>(undefined);

interface ModelSettingsProviderProps {
  children: ReactNode;
}

export const ModelSettingsProvider = ({ children }: ModelSettingsProviderProps) => {
  const [provider, setProvider] = useState<string>("google");
  const [model, setModel] = useState<string>("gemini-2.5-flash");

  return (
    <ModelSettingsContext.Provider value={{ provider, setProvider, model, setModel }}>
      {children}
    </ModelSettingsContext.Provider>
  );
};

export const useModelSettings = () => {
  const context = useContext(ModelSettingsContext);
  if (context === undefined) {
    throw new Error("useModelSettings must be used within a ModelSettingsProvider");
  }
  return context;
};
