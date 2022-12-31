import React, { useEffect, useState } from "react";
export const redirectCheck = React.createContext();

export const RedirectCheckProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(children)
}, [children]);

  return (
    <redirectCheck.Provider
      value={{
        open
      }}
    >
      {children}
    </redirectCheck.Provider>
  );
};