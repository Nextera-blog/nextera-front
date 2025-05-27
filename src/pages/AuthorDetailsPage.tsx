import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthorDetails } from "../types/api";
import { useAuth } from "../contexts/AuthContext";
import { getAuthorDetails } from "../services/authors";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";

export const AuthorDetailsPage: React.FunctionComponent = () => {
  const { id: authorIdFromRoute } = useParams();
  const { loading, error, data: author } = useFetch<AuthorDetails>(getAuthorDetails, authorIdFromRoute);
  const { user } = useAuth();
  const loggedInUserId = user?.id;
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [bioText, setBioText] = useState<string>('');

  useEffect(() => {
    if (author) {
      setBioText(author.bio || '');
    }
  }, [author]);

  const isCurrentUserAuthor = loggedInUserId !== null && author?.user === loggedInUserId;

  const handleUpdateClick = () => {
    setIsUpdating(true);
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBioText(e.target.value);
  }

  const handleSaveClick = () => {
    // TODO: Implémenter l'appel API pour sauvegarder la bio de l'auteur via le service authors.ts
    console.log('Fake sauvegarde bio (appel api à implémenter avec le back via authors.ts)', bioText);
    setIsUpdating(false);
  }

  return (
    <DataFetchingState loading={loading} error={error}>
    <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
      {author ? (
        <>
          <section className='card grow w-1/2 m-6 overflow-y-auto flex flex-col'>
            <p className="text-xl text-center mt-4">Qui est...</p>
            <h1 className='card-title'>{author.name}</h1>
            <div className="py-4 mx-8 my-4 border-y-2 border-sky-600 grow">
              {isUpdating ? (
                <textarea
                  className="w-full h-48 p-2 text-sky-900"
                  value={bioText}
                  onChange={handleBioChange}
                />
              ) : (
                <p className="whitespace-pre-wrap py-4 grow">{author.bio}</p>
              )}
              {isCurrentUserAuthor && !isUpdating && (
                <button onClick={handleUpdateClick} className="nextera-button mt-2">Modifier la bio</button>
              )}
              {isUpdating && (
                <div className="mt-2">
                  <button onClick={handleSaveClick} className="nextera-button mr-2">Sauvegarder</button>
                  <button onClick={() => setIsUpdating(false)} className="nextera-button-secondary">Annuler</button>
                </div>
              )}
            </div>
          </section>
          <section className='card grow w-1/2 m-6 overflow-y-auto flex flex-col'>
            <h2 className="card-title text-2xl text-center m-4">{(author.articles.length > 1) ? 'Ses articles' : 'Son article'}</h2>
            <ul className="whitespace-pre-wrap py-2 mx-8 border-y-2 border-sky-600 grow">
              {author.articles && author.articles.map((article) => (
                <li className="py-2" key={article.article_id}><Link to={`/articles/${article.article_id}`} className="hover:text-sky-600">{article.title}</Link></li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        !loading && !error && (
          <main className="p-4 flex justify-center items-center grow">
            <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">Auteur non trouvé.</p>
          </main>
        )
      )}
    </main>
    </DataFetchingState>
  );
};
