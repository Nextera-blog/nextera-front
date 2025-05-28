import { ArticleCard } from "../components/ArticleCard";
// import { Article } from "../types/api";
import { Article } from "../types/api";
import { getArticles } from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";

export const Home = () => {
  const { loading, error, data: articles } = useFetch<Article[]>(getArticles);

  console.log("Articles dans Home : ", articles);

  return (
    <DataFetchingState loading={loading} error={error}>
      <main className="p-4 flex flex-col items-center grow h-5/6 overflow-hidden">
        <h1 className="mb-10">Bienvenue sur Nextera Blog !</h1>

        {articles && articles.length > 0 ? (
          <section className="w-full grid grid-cols-1 gap-y-5 overflow-y-auto-sxroll md:max-h-full  md:w-7xl md:grid-cols-2 md:gap-x-10">
            {articles.map((article) => (
              <ArticleCard
                articleId={article.article_id}
                title={article.title}
                content={article.content}
                creationDate={article.creation_date}
                author={article.author} 
                tags={article.tags}
                article_reactions={article.article_reactions}
                key={article.article_id}
              />
            ))}
          </section>
        ) : (
          !loading && <p className="text-center">Aucun post pour le moment</p>
        )}
      </main>
    </DataFetchingState>
  );
};
