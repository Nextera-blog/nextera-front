import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isLoggedIn, user, isLoadingAuth } = useAuth();

    // console.log("isLoggedIn : ", isLoggedIn);
    // console.log("user : ", user);
    // console.log("isLoadingAuth : ", isLoadingAuth);

    if (isLoadingAuth) {
      return (
        <main className="p-4 flex flex-col justify-center items-center grow">
          <p className="mb-2">Chargement...</p>
          <img
            src="/loader.gif"
            className="w-3xs h-8"
            alt="Chargement en cours..."
          />
        </main>
      );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (user && user.role && allowedRoles.includes(user.role.role_name)) {
        return <>{children}</>
    }

    return <UnauthorizedPage />;
}
