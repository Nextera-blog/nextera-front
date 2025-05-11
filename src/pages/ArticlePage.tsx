import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { Article } from '../types/api';

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const { data: article, loading, error, fetchData: fetchArticle } = useApi<Article>(`/articles/${id}`);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [fetchArticle, id]);

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

  if (!article) {
    return <main className="p-4 flex justify-center items-center grow">
      <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">Article non trouvé.</p>
    </main>;
  }

  const creationDate = article.creation_date.split('T')[0];

  console.log(article);
  
  return (
    <main className="card grow m-10">
      <h1>{article.title}</h1>
      <p className="mb-8">Publié le {creationDate} par {article.author.username}</p>
      <div className="whitespace-pre-wrap"> {/* Preserve spaces and line breaks (\n) */}
        <p>{article.content}</p>
      </div>
    </main>
  );
};