import { useEffect } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { Article } from "../types/api";
import useApi from "../hooks/useApi";

export const Home = () => {
  const {
    data: articles,
    loading,
    error,
    fetchData: fetchArticles,
  } = useApi<Article[]>("/articles");

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  if (loading) {
    return (
      <main className="p-4 flex flex-col justify-center items-center grow">
        <p className="mb-2">Chargement de l'article</p>
        <img
          src="/loader.gif"
          className="w-3xs h-8"
          alt="Chargement en cours..."
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4 flex justify-center items-center grow">
        <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">{error}</p>
      </main>
    );
  }

  console.log(articles);

  return (
    <main className="p-4 flex flex-col items-center grow h-5/6 overflow-hidden">
      <h1 className="mb-10">Bienvenue sur Nextera Blog !</h1>

      {!loading && articles && articles.length > 0 ? (
        <section className="w-full grid grid-cols-1 gap-y-5 overflow-y-auto-sxroll md:max-h-full  md:w-7xl md:grid-cols-2 md:gap-x-10">
          {articles.map((article) => {
            return (
              <ArticleCard
                articleId={article.article_id}
                title={article.title}
                content={article.content}
                authorId={article.author_id}
                creationDate={article.creation_date}
                author={article.author}
                key={article.article_id}
              />
            );
          })}
        </section>
      ) : (
        <p className="text-center">Aucun post pour le moment</p>
      )}
    </main>
  );
};
