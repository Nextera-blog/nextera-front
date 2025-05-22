import { Link, useParams } from "react-router-dom";
import { Article } from "../types/api";
import { getArticleById } from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const {
    loading,
    error,
    data: article,
  } = useFetch<Article>(getArticleById, id);

  // if (article) {
  //   // const creationDate = article.creation_date.split('T')[0];
  //   console.log("Article : ", article);
  //   console.log("Article avant rendu :", article);
  //   console.log("Article.author avant rendu :", article?.author);
  // }

  return (
    <DataFetchingState loading={loading} error={error}>
      <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
        {article ? (
          <>
            <section className="card grow w-1/2 m-6 overflow-y-auto-scroll flex flex-col">
              <h1 className="card-title">{article.title}</h1>
              <p className="whitespace-pre-wrap py-8 mx-8 my-4 border-y-2 border-sky-600 grow">
                {article.content}
              </p>
              <p className="my-4 mr-8 text-end">
                Publié le {article.creation_date.split("T")[0]} par{" "}
                <Link to={`/authors/${article.author.user}`}>
                  {article.author.name}
                </Link>
              </p>
            </section>
            <section className="card grow w-1/2 m-6 overflow-y-auto-scroll flex flex-col bg-sky-950 border-sky-50 border-1 text-sky-50">
              Commentaires           
              {article.comments && article.comments.length > 0 && (
                  article.comments.map(comment => (
                    <div className="card bg-sky-950 border-sky-50 border-1 text-sky-50">
                      <p>@{comment.user.name} . {comment.creation_date.split('T')[0]}</p>
                      <p>{comment.content}</p>
                    </div>
                  ))
                )}
            </section>            
          </>
        ) : (
          !loading &&
          !error && (
            <main className="p-4 flex justify-center items-center grow">
              <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">
                Article non trouvé.
              </p>
            </main>
          )
        )}
      </main>
    </DataFetchingState>
  );
};
