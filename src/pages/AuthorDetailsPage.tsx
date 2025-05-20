import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { AuthorDetails } from '../types/api';
import { useAuth } from '../contexts/AuthContext';

export const AuthorDetailsPage: React.FunctionComponent = () => {
  // Renaming in destructuration to make code clearer and easier to debug
  const { id: authorIdFromRoute } = useParams();
  const { data: author, loading, error, fetchData: fetchAuthor } = useApi<AuthorDetails>(`/authors/${authorIdFromRoute}`);
  const { userId: LoggedInUserId } = useAuth();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [bioText, setBioText] = useState<string>('');

  useEffect(() => {
    if (authorIdFromRoute) {
      fetchAuthor();
    }
  }, [fetchAuthor, authorIdFromRoute]);

  useEffect(() => {
    if (author) {
      setBioText(author.bio);
    }
  }, [author]);

  if (loading) {
    return <main className="p-4 flex flex-col justify-center items-center grow">
      <p className="mb-2">Chargement de l'article</p>
      <img src="/loader.gif" className="w-3xs h-8" alt="Chargement en cours..." />
    </main>;
  }

  if (error) {
    return <main className="p-4 flex justify-center items-center grow">
      <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">{error}</p>
    </main>;
  }

  if (!author) {
    return <main className="p-4 flex justify-center items-center grow">
      <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">Article non trouvé.</p>
    </main>;
  }

  // console.log(author);

  const isCurrentUserAuthor = LoggedInUserId !== null && author.user === LoggedInUserId;

  const handleUpdateClick = () => {
    setIsUpdating(true);
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBioText(e.target.value);
  }

  const handleSaveClick = () => {
    // Api call to implement with backend - to see with Alex
    console.log('Fake sauvegarde bio (appel api à implémenter avec le back', bioText);
    setIsUpdating(false);
  }
  
  return (
    <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
      <section className='card grow w-1/2 m-6 overflow-y-auto-scroll flex flex-col'>
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
      <section className='card grow w-1/2 m-6 overflow-y-auto-scroll flex flex-col'>
        <h2 className="card-title text-2xl text-center m-4">Articles</h2>
        <ul className="whitespace-pre-wrap py-2 mx-8 border-y-2 border-sky-600 grow">
            {author.articles && author.articles.map((article) => (
                <li className="py-2" key={article.article_id}><Link to={`/articles/${article.article_id}`}>{article.title}</Link></li>
            ))}
        </ul>
      </section>
    </main>
  );
};