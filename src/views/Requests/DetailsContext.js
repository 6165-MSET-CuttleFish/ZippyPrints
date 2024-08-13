import React, { createContext, useState } from 'react';

export const CurrentDetailsContext = createContext();

export const DetailsProvider = ({ children }) => {
  const [details, setDetails] = useState(false);
  
  return (
    <CurrentDetailsContext.Provider value={{ details, setDetails }}>
      {children}
    </CurrentDetailsContext.Provider>
  );
}
