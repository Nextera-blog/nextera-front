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
    <header className="w-full flex bg-slate-850 border-b-1 border-sky-500 p-2 mb-2 flex justify-between items-center">
      <nav>
        <NavLink to='/'>Accueil</NavLink>
      </nav>
      <button type="button" onClick={handleAuthButtonClick} className="nextera-button">
        {isLoggedIn ? 'Se déconnecter' : 'Se connecter'}
      </button>
    </header>
  )
}