import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetArticle } from '../hooks/useGetArticle';

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const { article, loading, error } = useGetArticle(id);

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

  // Case where the article is null after loading (either the API returned a success with no data, or an unhandled error led to this state).
  if (!article) {
    return <main className="p-4 flex justify-center items-center grow">
      <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">Article non trouvé.</p>
    </main>;
  }

  const creationDate = article.creation_date.split('T')[0];

  console.log(article);
  
  return (
    <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
      <section className='card grow w-1/2 m-6 overflow-y-auto-scroll flex flex-col'>
        <h1 className='card-title'>{article.title}</h1>
        <p className="whitespace-pre-wrap py-4 mx-8 my-4 border-y-2 border-sky-600 grow">{article.content}</p>
        <p className="my-4 mr-8 text-end">Publié le {creationDate} par {article.author.username}</p>
      </section>
    </main>
  );
};