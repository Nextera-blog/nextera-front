import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleDarkMode,
  darkMode,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  // console.log("isLoggedIn : ", isLoggedIn);
  // console.log("user : ", user);
  // console.log("user.role.role : ", user?.role?.role_name);

  const isAuthorisedToCreateArticle =
    user?.author?.user === user?.id && user?.role?.role_name === "Author";

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="w-full grid grid-cols-3 border-b-1 py-2 px-2 items-center">
      <div className="justify-self-start flex items-center">
        <img src="/nextera-logo.png" alt="Logo Nextera" className="w-10 mr-2" />
        <p className="hidden md:inline md:text-xl">Nextera blog</p>
      </div>
      
      <nav className="justify-self-center flex items-center">
        <NavLink to="/" className="nav-link">
          Accueil
        </NavLink>
        {isAuthorisedToCreateArticle && (
          <NavLink to="/redaction-article" className="nav-link">
            Rédiger un article
          </NavLink>
        )}
      </nav>
      
      <div className="justify-self-end flex items-center">
        {isLoggedIn && (
          <Link to="/profile" className="mr-8 hover:underline hover:underline-offset-3 hover:font-bold">{user?.username}</Link>
        )}      
        <button type="button" onClick={handleAuthButtonClick} className="nextera-button">
          {isLoggedIn ? "Se déconnecter" : "Se connecter"}
        </button>
        <button onClick={onToggleDarkMode} className="mx-8">
          {darkMode ? "Mode Clair" : "Mode Sombre"}
        </button>
      </div>
    </header>
  );
};
