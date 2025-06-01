import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getCurrentUser, updateProfile } from "../services/users";
import { NotificationCard } from "../components/NotificationCard";

export const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [authorName, setAuthorName] = useState(user?.author?.name || "");
  const [bio, setBio] = useState(user?.author?.bio || "");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalError, setModalError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);
  const canSave = !emailError;

  console.log("user : ", user);

  useEffect(() => {
    if (openModal) {
      const timer = setTimeout(() => {
        setOpenModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openModal]);

  if (!user) {
    console.log("Vous nêtes pas connecté.");
    return <Navigate to="/login" />;
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(null);
  }

  const checkEmailUniqueness = async () => {
    if (email === user?.email) {
      setEmailError(null);
      return;
    }
    setIsCheckingEmail(true);
    try {
      const userData = {
        id: user.id,
        email: email,
        username: username,
        first_name: firstName,
        last_name: lastName,
        author: {
          name: authorName,
          bio: bio,
        },
      };
      await updateProfile(userData, user.id);
      setEmailError(null);
    } catch (error: any) {
      console.error("Erreur lors de la vérification de l'email : ", error);
      console.error("Réponse détaillée du backend : ", error.response?.data);
      if (error.response?.data?.error === "Email indisponible") {
        setEmailError("Cet email est déjà utilisé.");
      } else if (error.response?.data?.error === "Email invalide") {
        setEmailError("Format d'email invalide.");
      } else {
        console.error("Erreur lors de la vérification de l'email : ", error);
        setEmailError("Erreur lors de la vérification de l'email.");
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      setModalError(false);
      setModalMessage(null);
      setOpenModal(false);
      try {
        if (emailError) {
          setModalMessage("Veuillez corriger l'erreur d'email.");
          setModalError(true);
          setOpenModal(true);
          return;
        }

        const userData = {
          id: user.id,
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          author: {
            name: authorName,
            bio,
          },
        };

        console.log("Données envoyées pour la MAJ :", userData);

        await updateProfile(userData, user.id);
        setModalMessage("Profil mis à jour avec succès !");
        setModalError(false);
        setOpenModal(true);
        setIsEditing(false);

        // Updating the context
        try {
          const updatedUser = await getCurrentUser();
          const accessToken = localStorage.getItem('access_token');
          const refreshToken = localStorage.getItem('refresh_token');
          if (accessToken && refreshToken) {
            login(accessToken, refreshToken, updatedUser);
          }
        } catch (getCurrentUserError) {
          console.error("Erreur lors de la récupération de l'utilisateur mis à jour : ", getCurrentUserError);
          setModalMessage("Mise à jour sauvegardé, mais erreur lors du rafraîchissemnet des informations du profil.");
          setModalError(true);
          setOpenModal(true);
        }

      } catch (error: any) {
        console.error("Erreur lors de la mise à jour du profil : ", error);
        setModalMessage("Erreur lors de la mise à jour du profil.");
        setModalError(true);
        setOpenModal(true);
        if (error.response) {
          console.log("Réponse du backend :", error.response.data);
        }
      } finally {
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
      <h1>Votre profil</h1>

      <button onClick={handleEditToggle} className={isEditing ? (canSave ? "bg-sky-500 text-sky-50" : "bg-gray-400 text-gray-100 cursor-not-allowed") : "bg-red-500 text-white"} disabled={isEditing && (!canSave || isCheckingEmail)}>
        {isEditing
          ? "Sauvegarder"
          : "Editer"}
      </button>

      {openModal && <NotificationCard message={modalMessage} error={modalError} openModal={openModal} />}

      <section className="card grow m-6 overflow-y-auto flex flex-col md:w-4/5 article-section">
        <h2 className="card-title text-2xl text-center m-4">
          Profil Utilisateur
        </h2>
        <div className="py-4 mx-8 my-4 border-y-2 border-sky-600 grow flex flex-col gap-y-4">
          <div className="flex flex-col">
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              readOnly={!isEditing}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">email :</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={isEditing ? checkEmailUniqueness : undefined}
              readOnly={!isEditing}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            {isCheckingEmail && <p className="text-gray-500 text-sm mt-1">Vérification de l'email...</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="firstName">Prénom :</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              readOnly={!isEditing}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName">Nom :</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              readOnly={!isEditing}
            />
          </div>
          <p className="py-2">Rôle : {user.role?.role_name}</p>
        </div>
      </section>
      <section className="card grow m-6 overflow-y-auto flex flex-col md:w-4/5 comments-section">
        <h2 className="card-title text-2xl text-center m-4">Profil Auteur</h2>
        <div className="py-4 mx-8 my-4 border-y-2 border-sky-600 grow flex flex-col gap-y-4">
          <p className="py-4">
            Voir votre{" "}
            <Link to={`/authors/${user.author.user}`} className="link">
              page Auteur
            </Link>
          </p>
          <div className="flex flex-col">
            <label htmlFor="authorName">Pseudo (Auteur) :</label>
            <input
              type="text"
              name="authorName"
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              readOnly={!isEditing}
            />
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
