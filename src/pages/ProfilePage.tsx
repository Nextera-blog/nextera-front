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
    <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
        <h1>Votre profil</h1>
      <section className="card grow m-6 overflow-y-auto flex flex-col md:w-4/5 article-section">
        <h2 className="card-title text-2xl text-center m-4">Profil Utilisateur</h2>
            <div className="py-4 mx-8 my-4 border-y-2 border-sky-600 grow">
        <p className="py-2">Nom d'utilisateur : {user.username}</p>
        <p className="py-2">email : {user.email}</p>
        <p className="py-2">Prénom : {user.first_name}</p>
        <p className="py-2">Nom : {user.last_name}</p>
        </div>
      </section>
      <section className="card grow m-6 overflow-y-auto flex flex-col md:w-4/5 comments-section">
        <h2 className="card-title text-2xl text-center m-4">Profil Auteur</h2>
        <div className="py-4 mx-8 my-4 border-y-2 border-sky-600 grow">
        <p className="py-4">
          Voir votre{" "}
          <Link to={`/authors/${user.author.user}`} className="link py-2">page Auteur</Link>
        </p>
        <p className="py-2">Pseudo (Auteur) : {user.author?.name}</p>
        {user.author?.profile_picture_url && 
            <img src={user.author?.profile_picture_url} alt="Photo de profil"/>
        }
        {user.author?.bio && (
            <>
            <p className="py-2">Bio :</p>
            <textarea
                className="w-full h-48 p-4 bg-sky-50 text-sky-900 rounded-md border border-sky-600"
                value={user.author?.bio}
                readOnly={true} // TO DO : temporary: to be modified when the route for saving changes is opened
            />
            </>
        )}
        </div>
      </section>
    </main>
  );
};
