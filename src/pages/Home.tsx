import { useEffect, useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { getPosts } from "../hooks/apiRequest";
import { Article } from "../types/api";

export const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);

  /* const posts = [{article_id: 1, title: "Le minimalisme numérique", content: "Le mininimalisme numérique consiste à réduire la surcharge digitale...", creation_date: "2025-05-05T17:29:49+02:00", author_id: 2}]; */
  useEffect(() => {
    getPosts(setLoading, setArticles);
  }, []);

  if (loading) {
    return <main className="p-4 flex justify-center items-center grow">
      <p>Récupération des articles</p>
      <p className="animate-bounce ml-2">. . .</p>
    </main>
  }

  return (
    <main className="p-4 flex flex-col items-center grow">
      <h1 className="mb-10">Bienvenue sur Nextera Blog !</h1>

      {!loading && articles.length > 0 ? 
        <section className="w-7xl grid grid-cols-2 gap-12">
          {articles.map((article) => {
            return <ArticleCard articleId={article.article_id} title={article.title} content={article.content} authorId={article.author_id} creationDate={article.creation_date} author={article.author} />
          })}
        </section>
        : <p className="text-center">Aucun post pour le moment</p>
      }
    </main>
  )
}