import { useEffect, useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { getArticles } from "../hooks/apiRequest";
import { Article } from "../types/api";

export const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles(setLoading, setArticles);
  }, []);

  if (loading) {
    return <main className="p-4 flex flex-col justify-center items-center grow">
      <p className="mb-2">Récupération des articles</p>
      <img src="/loader.gif" className="w-3xs h-8" alt="Chargement en cours..." />
    </main>
  }

  return (
    <main className="p-4 flex flex-col items-center grow h-5/6 overflow-hidden">
      <h1 className="mb-10">Bienvenue sur Nextera Blog !</h1>

      {!loading && articles.length > 0 ? 
        <section className="w-full grid grid-cols-1 gap-y-5 overflow-y-auto md:max-h-full  md:w-7xl md:grid-cols-2 md:gap-x-10">
          {articles.map((article) => {
            return <ArticleCard articleId={article.article_id} title={article.title} content={article.content} creationDate={article.creation_date} author={article.author} key={article.article_id} />
          })}
        </section>
        : <p className="text-center">Aucun post pour le moment</p>
      }
    </main>
  )
}