import { NavLink, useNavigate } from "react-router-dom"

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full flex bg-slate-850 border-b-1 border-sky-500 p-2 mb-2 flex justify-between items-center">
      <nav>
        <NavLink to='/'>Accueil</NavLink>
      </nav>
      {/* change router direction when connexion page is connect to Router */}
      <button type="button" onClick={() => navigate('/')} className="nextera-button">Se connecter</button>
    </header>
  )
}