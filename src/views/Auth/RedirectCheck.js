import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";
import { useLocation } from "react-router-dom";
export const RedirectCheck = React.createContext();

export const RedirectCheckProvider = ({ children }) => {
  const {currentUser} = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  let location = useLocation();
    useEffect(()=>{
      if(currentUser===null&& location.pathname == "/discover"){
        setOpen(true)
      }
      else{
        setOpen(false)
      }
    }, [location.pathname])

  return (
    <RedirectCheck.Provider
      value={{
        open
      }}
    >
      {children}
    </RedirectCheck.Provider>
  );
};