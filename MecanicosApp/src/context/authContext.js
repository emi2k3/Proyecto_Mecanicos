import React, {createContext, useState, useContext} from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [rol, setRol] = useState(null);
  return (
    <AuthContext.Provider value={{rol, setRol}}>
      {children}
    </AuthContext.Provider>
  );
};
