import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("timeledger_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("timeledger_token") || null;
  });

  const login = (email, password) => {
    if (email && password) {
      const mockUser = { email, username: email.split("@")[0] };
      const mockToken = "mock-jwt-token-12345";

      setUser(mockUser);
      setToken(mockToken);

      localStorage.setItem("timeledger_user", JSON.stringify(mockUser));
      localStorage.setItem("timeledger_token", mockToken);

      return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const register = (username, email, password) => {
    if (username && email && password) {
      const newUser = { email, username };
      const mockToken = "mock-jwt-token-67890";

      setUser(newUser);
      setToken(mockToken);

      localStorage.setItem("timeledger_user", JSON.stringify(newUser));
      localStorage.setItem("timeledger_token", mockToken);

      return { success: true };
    }
    return { success: false, error: "Please fill in all fields" };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("timeledger_user");
    localStorage.removeItem("timeledger_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}