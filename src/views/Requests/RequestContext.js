import React, { createContext, useState } from 'react';

export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [req, setReq] = useState();


  return (
    <RequestContext.Provider value={{ req, setReq }}>
      {children}
    </RequestContext.Provider>
  );
}
