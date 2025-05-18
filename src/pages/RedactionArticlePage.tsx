import { useEffect, useState } from "react";
import { createArticle } from "../hooks/apiRequest";
import { NotificationCard } from "../components/NotificationCard";
import { useNavigate } from "react-router-dom";

export const RedactionArticlePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate('/');
    }
  },[])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get form data values
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    createArticle(title, content, setMessage, setError);

    setOpenModal(true);
    setTimeout(() => 
      {
        setOpenModal(false);
        if (!error) {
          navigate('/');
        }
      }, 3000
    );
  }

  return (
    <main className="grow flex flex-col items-center h-5/6 overflow-hidden pb-6 relative">
      <h1>Rédiger un article</h1>
      {openModal && <NotificationCard message={message} error={error} openModal={openModal} />}

      <section className="card w-5/6 grow p-4 h-full md:mt-2 md:w-1/2 flex flex-col">
        <h2 className="text-center mb-4 md:my-2">Nouvel article</h2>

        <form method="POST" action="" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleFormSubmit(e)} className="flex flex-col gap-2 grow md:px-10 md:pt-4 md:pb-2">
          <label htmlFor="title">Titre de l'article</label>
          <input type="text" name="title" id="title" className="md:p-3" />

          <label htmlFor="content">Contenu de l'article</label>
          <textarea name="content" id="content" className="grow overflow-y-scroll"></textarea>

          <button type="submit" className="self-center mt-2">Valider</button>
        </form>
      </section>
    </main>
  );
};
