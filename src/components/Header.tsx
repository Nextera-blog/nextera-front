import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="w-full flex border-b-1 border-sky-500 py-2  px-2 mb-2 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/nextera-logo.png" alt="Logo Nextera" className="w-10 mr-2" />
        <p className="hidden md:inline md:text-base">Nextera blog</p>
      </div>
      <nav className="flex justify-center items-center">
        <NavLink to='/' className="nav-link">Accueil</NavLink>
        <NavLink to='/redaction-article' className="nav-link">Rédiger un article</NavLink>
      </nav>
      <button type="button" onClick={handleAuthButtonClick} className="nextera-button">
        {isLoggedIn ? 'Se déconnecter' : 'Se connecter'}
      </button>
    </header>
  )
}