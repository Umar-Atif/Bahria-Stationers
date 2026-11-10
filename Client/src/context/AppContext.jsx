// import { createContext, useContext, useState } from "react";

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [token, setToken] = useState(
//     () => localStorage.getItem("token")
//   );

//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");

//     try {
//       return savedUser ? JSON.parse(savedUser) : null;
//     } catch {
//       return null;
//     }
//   });

//   const login = (userData, authToken) => {
//     localStorage.setItem("token", authToken);
//     localStorage.setItem("user", JSON.stringify(userData));

//     setToken(authToken);
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         user,
//         token,
//         isLoggedIn: Boolean(token),
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => useContext(AppContext);



import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (!payload.exp) return true;

    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");

    if (isTokenExpired(savedToken)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }

    return savedToken;
  });

  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");

    if (isTokenExpired(savedToken)) return null;

    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, authToken) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // Automatically check token expiry
  useEffect(() => {
    if (!token) return;

    const checkExpiry = () => {
      if (isTokenExpired(token)) {
        logout();
      }
    };

    checkExpiry();

    const interval = setInterval(checkExpiry, 10000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        isLoggedIn: Boolean(token && user),
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
