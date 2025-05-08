import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetArticle } from '../hooks/useGetArticle';

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const { article, loading, error } = useGetArticle(id);

  if (loading) {
    return <main className="p-4 flex justify-center items-center grow">
      <p>Chargement de l'article</p>
      <p className="animate-bounce ml-2">. . .</p>
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
  
  return (
    <main className="card grow m-10">
      <h1>{article.title}</h1>
      <p className="mb-8">Publié le {creationDate} par {article.author.name}</p>
      <div className="whitespace-pre-wrap"> {/* Preserve spaces and line breaks (\n) */}
        <p>{article.content}</p>
      </div>
    </main>
  );
};
