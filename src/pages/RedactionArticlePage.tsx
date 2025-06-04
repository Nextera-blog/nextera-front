import { useEffect, useState } from "react";
// import { createArticle } from "../hooks/apiRequest";
import { NotificationCard } from "../components/NotificationCard";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../services/articles";
import { useAuth } from "../contexts/AuthContext";

export const RedactionArticlePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null); // renaming to have the same thing as in ProfilePage
  const [modalError, setModalError] = useState<boolean>(false); // renaming to have the same thing as in ProfilePage
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  const userId = user?.id;
  
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate('/');
    }
  }, [navigate])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalMessage(null);
    setModalError(false);

    // get form data values
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    // createArticle(title, content, setMessage, setError);

    // setOpenModal(true);
    // setTimeout(() => 
    //   {
    //     setOpenModal(false);
    //     if (!error) {
    //       navigate('/');
    //     }
    //   }, 3000
    // );

    try {
      if (userId) {
        await createArticle(title, content, userId);
        setModalMessage("Article créé avec succès !");
        setModalError(false);
        setOpenModal(true);
        setTimeout(() => {
          setOpenModal(false);
          navigate('/');
        }, 3000);
      } else {
        setModalMessage("Vous devez être connecté pour créer un article.");
        setModalError(true);
        setOpenModal(true);
      }
    } catch (err: any) {
      console.error("Erreur lors de la création de l'article : ", err);
      setModalMessage(err.response?.data?.message || err.message || "Erreur lors de la création de l'article.");
      setModalError(true);
      setOpenModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grow flex flex-col items-center h-5/6 overflow-hidden pb-6 relative">
      <h1>Rédiger un article</h1>
      {openModal && <NotificationCard message={modalMessage} error={modalError} openModal={openModal} />}

      <section className="card w-5/6 grow p-4 h-full md:mt-2 md:w-1/2 flex flex-col">
        <h2 className="text-center mb-4 md:my-2">Nouvel article</h2>

        {/* <form method="POST" action="" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleFormSubmit(e)} className="flex flex-col gap-2 grow md:px-10 md:pt-4 md:pb-2">
          <label htmlFor="title">Titre de l'article</label>
          <input type="text" name="title" id="title" className="md:p-3" /> */}

        <form method="POST" action="" onSubmit={handleFormSubmit} className="flex flex-col gap-2 grow md:px-10 md:pt-4 md:pb-2">
          <label htmlFor="title">Titre de l'article</label>
          <input type="text" name="title" id="title" className="md:p-3" required />

          <label htmlFor="content">Contenu de l'article</label>
          <textarea name="content" id="content" className="grow overflow-y"></textarea>

          {/* <button type="submit" className="self-center mt-2">Valider</button> */}

          <button type="submit" className="self-center mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Création en cours...' : 'Valider'}
          </button>
        </form>
      </section>
    </main>
  );
};
