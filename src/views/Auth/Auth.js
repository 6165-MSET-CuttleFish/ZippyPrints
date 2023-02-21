import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const auth = getAuth();
  const [timeActive, setTimeActive] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setPending(false)
    });
  }, [auth]);

  if(pending){
    return <>Loading...</>
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser, 
        timeActive, 
        setTimeActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};