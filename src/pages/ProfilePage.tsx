import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  console.log("user : ", user);

  if (!user) {
    console.log("Vous nêtes pas connecté.");
    return <Navigate to="/login" />;
  }

  return (
    <main>
      <h1>Votre profil</h1>
      <div>
        <h2>Profil Utilisateur</h2>
        <p>Nom d'utilisateur : {user.username}</p>
        <p>email : {user.email}</p>
        <p>Prénom : {user.first_name}</p>
        <p>Nom : {user.last_name}</p>

        <h2>Profil Auteur</h2>
        <p>Voir votre <Link to={`/authors/${user.author.user}`}>page Auteur</Link></p>
        <p>Pseudo (Auteur) : {user.author?.name}</p>
        <p>{user.author?.profile_picture_url}</p>
        <p>Bio : {user.author?.bio}</p>
      </div>
    </main>
  );
};
