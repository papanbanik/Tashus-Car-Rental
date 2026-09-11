// MaxWidthContext.js
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MaxWidthContextType {
  maxWidth: string;
  setMaxWidth: React.Dispatch<React.SetStateAction<string>>;
}

const MaxWidthContext = createContext<MaxWidthContextType | undefined>(undefined);

interface MaxWidthProviderProps {
  children: ReactNode;
}

export const MaxWidthProvider: React.FC<MaxWidthProviderProps> = ({ children }) => {
  const [maxWidth, setMaxWidth] = useState<string>('1300px');

  return <MaxWidthContext.Provider value={{ maxWidth, setMaxWidth }}>{children}</MaxWidthContext.Provider>;
};

export const useMaxWidth = () => {
  const context = useContext(MaxWidthContext);
  if (!context) {
    throw new Error('useMaxWidth must be used within a MaxWidthProvider');
  }
  return context;
};
