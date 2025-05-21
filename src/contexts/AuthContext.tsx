import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, userId: number) => void;
  logout: () => void;
  userId: number | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userId: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get<{ id: number }>('/users/current/');
        setUserId(response.data.id);
        setIsLoggedIn(true);
      } catch (error: any) {
        console.error("Erreur lors de la récupéraiton de l'utilisateur courant : ", error);
        logout();
      }
    };

    if (accessToken) {
      fetchCurrentUser();
    }
  }, [logout]);

  const login = (accessToken: string, refreshToken: string, userId: number) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setIsLoggedIn(true);
    setUserId(userId);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};