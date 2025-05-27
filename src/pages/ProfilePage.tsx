import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(user?.username || ""); // TO SEE WITH BACKEND : can this field be modified ?
  const [email, setEmail] = useState(user?.email || ""); // TO SEE WITH BACKEND : can this field be modified ?
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [authorName, setAuthorName] = useState(user?.author?.name || "");
  const [bio, setBio] = useState(user?.author?.bio || "");

  console.log("user : ", user);

  if (!user) {
    console.log("Vous nêtes pas connecté.");
    return <Navigate to="/login" />;
  }

  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Logic to save to implement"); // TO DO
    } else {
      setIsEditing(true);
    }
  };

  return (
    <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
      <h1>Votre profil</h1>

      <button onClick={handleEditToggle}>
        {isEditing ? "Modifiez vos informations puis cliquez ici pour sauvegarder" : "Cliquez ici pour modifier vos informations"}
      </button>

      <section className="card grow m-6 overflow-y-auto flex flex-col md:w-4/5 article-section">
        <h2 className="card-title text-2xl text-center m-4">
          Profil Utilisateur
        </h2>
        <div className="py-4 mx-8 my-4 border-y-2 border-sky-600 grow flex flex-col gap-y-4">
          <div className="flex flex-col">
            <label htmlFor="userName">Nom d'utilisateur :</label>
            <input type="text" name="userName" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} readOnly={!isEditing} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">email :</label>
            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!isEditing} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="firstName">Prénom :</label>
            <input type="text" name="firstName" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} readOnly={!isEditing} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName">Nom :</label>
            <input type="text" name="lastName" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} readOnly={!isEditing} />
          </div>
          <p className="py-2">Rôle : {user.role?.role_name}</p>
        </div>
      </section>
      <section className="card grow m-6 overflow-y-auto flex flex-col md:w-4/5 comments-section">
        <h2 className="card-title text-2xl text-center m-4">Profil Auteur</h2>
        <div className="py-4 mx-8 my-4 border-y-2 border-sky-600 grow flex flex-col gap-y-4">
          <p className="py-4">
            Voir votre {" "}
            <Link to={`/authors/${user.author.user}`} className="link">
              page Auteur
            </Link>
          </p>
          <div className="flex flex-col">
            <label htmlFor="authorName">Pseudo (Auteur) :</label>
            <input type="text" name="authorName" id="authorName" value={authorName} onChange={(e) => setAuthorName(e.target.value)} readOnly={!isEditing} />
          </div>
          {user.author?.profile_picture_url && (
            <img src={user.author?.profile_picture_url} alt="Photo de profil" />
          )}
          <div className="flex flex-col">
            <label htmlFor="bio">Bio :</label>
            <textarea
                id="bio"
                name="bio"
                className="w-full h-48 p-4 bg-sky-50 text-sky-900 rounded-md border border-sky-600"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                readOnly={!isEditing}
              />
          </div>
        </div>
      </section>
    </main>
  );
};
