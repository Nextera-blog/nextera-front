import { NavLink, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full flex border-b-1 border-sky-500 py-2 px-4 mb-2 flex justify-between items-center">
      <nav>
        <NavLink to='/' className="nav-link">Accueil</NavLink>
      </nav>
      {/* change router direction when connexion page is connect to Router */}
      <button type="button" onClick={() => navigate('/')}>Se connecter</button>
    </header>
  )
}