import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { CurrentUser } from "../types/api";
import { getCurrentUser } from "../services/users";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, user: CurrentUser) => void;
  logout: () => void;
  user: CurrentUser | null;
  isLoadingAuth: boolean; // Loading state to avoid problems with the protected route (now, the protected route waits for the load to finish before deciding whether the user is logged in or not)
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  user: null,
  isLoadingAuth: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const fetchCurrentUser = async () => {
      setIsLoadingAuth(true);
      try {
        const currentUserData = await getCurrentUser();
        setUser(currentUserData);
        // console.log("currentUserData : ", currentUserData);
        setIsLoggedIn(true);
      } catch (error: any) {
        console.error("Erreur lors de la récupéraiton de l'utilisateur courant : ", error);
        logout();
      } finally {
        setIsLoadingAuth(false);
      }
    };

    if (accessToken) {
      fetchCurrentUser();
    } else {
      setIsLoadingAuth(false);
    }
  }, [logout]);

  const login = (accessToken: string, refreshToken: string, user: CurrentUser) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setIsLoggedIn(true);
    setUser(user);
    // console.log("User in login:", user);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};