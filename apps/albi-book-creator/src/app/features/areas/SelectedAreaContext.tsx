import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedAreaContextType {
  selectedArea: number | null;
  setSelectedArea: (area: number | null) => void;
}

const SelectedAreaContext = createContext<SelectedAreaContextType | undefined>(
  undefined
);

export const SelectedAreaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);

  return (
    <SelectedAreaContext.Provider value={{ selectedArea, setSelectedArea }}>
      {children}
    </SelectedAreaContext.Provider>
  );
};

export const useSelectedArea = (): SelectedAreaContextType => {
  const context = useContext(SelectedAreaContext);
  if (context === undefined) {
    throw new Error(
      'useSelectedArea must be used within a SelectedAreaProvider'
    );
  }
  return context;
};
