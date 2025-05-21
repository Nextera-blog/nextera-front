import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// import useApi from '../hooks/useApi';
import { Article } from '../types/api';
import { getArticleById } from '../services/articles';

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const { data: article, loading, error, fetchData: fetchArticle } = useApi<Article>(`/articles/${id}`);

  // useEffect(() => {
  //   if (id) {
  //     fetchArticle();
  //   }
  // }, [fetchArticle, id]);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const data = await getArticleById(id);
          setArticle(data);
        } catch (err: any) {
          console.error(`Erreur lors de la récupération de l'article ${id} : `, err);
          setError(err.message || 'Une erreur est survenue lors de la récupération de l\'article.');
          setArticle(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticleData();
  }, [id]);

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

  console.log("Article : ", article);
  console.log("Article avant rendu :", article);
  console.log("Article.author avant rendu :", article?.author);
  
  return (
    <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
      <section className='card grow w-1/2 m-6 overflow-y-auto-scroll flex flex-col'>
        <h1 className='card-title'>{article.title}</h1>
        <p className="whitespace-pre-wrap py-8 mx-8 my-4 border-y-2 border-sky-600 grow">{article.content}</p>
        <p className="my-4 mr-8 text-end">Publié le {creationDate} par <Link to={`/authors/${article.author.user}`}>{article.author.name}</Link></p>
      </section>
    </main>
  );
};