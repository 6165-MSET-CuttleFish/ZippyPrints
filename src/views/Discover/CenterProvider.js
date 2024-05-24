import React, { createContext, useState } from 'react';

export const CurrentCenterContext = createContext();

export const CenterProvider = ({ children }) => {
  const [center, setCenter] = useState({ lat: 36.7783, lng: -96.4179 });
  const [selected, setSelected] = useState(null);

  return (
    <CurrentCenterContext.Provider value={{ center, setCenter }}>
      {children}
    </CurrentCenterContext.Provider>
  );
}