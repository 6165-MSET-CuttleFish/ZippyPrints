import React, { createContext, useState } from 'react';

export const CurrentSelectedContext = createContext();

export const SelectedProvider = ({ children }) => {
  const [selected, setSelected] = useState(null);

  return (
    <CurrentSelectedContext.Provider value={{ selected, setSelected }}>
      {children}
    </CurrentSelectedContext.Provider>
  );
}