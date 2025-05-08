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
      <p className="text-red-500">{error}</p>
    </main>;
  }

  if (!article) {
    return <main className="p-4 flex justify-center items-center grow">
      <p>Article non trouvé.</p>
    </main>;
  }

  const creationDate = article.creation_date.split('T')[0];
  
  return (
    <main className="p-4 flex flex-col items-start grow w-full max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-2">Publié le {creationDate} par {article.author.name}</p>
      <div className="prose prose-sm md:prose lg:prose-lg xl:prose-xl dark:prose-invert">
        <p>{article.content}</p>
      </div>
    </main>
  );
};