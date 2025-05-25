import { Link, useParams } from "react-router-dom";
import { Article } from "../types/api";
import { getArticleById } from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";
import CommentCard from "../components/CommentCard";
import { capitalizeFirstLetter } from "../utils/utils";

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const {
    loading,
    error,
    data: article,
  } = useFetch<Article>(getArticleById, id);

  // if (article) {
  //   console.log("Article : ", article);
  // }

  return (
    <DataFetchingState loading={loading} error={error}>
      <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">      
        {article ? (
          <>
            <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 article-section">
              <h1 className="card-title">{article.title}</h1>
              <p className="whitespace-pre-wrap py-8 mx-8 my-4 border-y-2 border-sky-600 grow">
                {article.content}
              </p>
              <p className="my-4 mr-8 text-end">
                Publié le {new Date(article.creation_date).toLocaleDateString("fr-FR")} par{" "}
                <Link to={`/authors/${article.author.user}`} className="hover:text-sky-600">
                  {article.author.name}
                </Link>
              </p>

              {article.tags && article.tags.length > 0 && (
                <div>
                  {/* <h2>Tags :</h2> */}
                  <div>
                    {article.tags.map((tag) => (
                      <span key={tag.tag_id} className="tag">{capitalizeFirstLetter(tag.name)}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
            <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 comments-section">
              {article.comments && article.comments.length > 0 && (
              <>
                <h2 className="mb-4">Commentaires</h2>
                {article.comments.map(comment => (
                  <CommentCard key={comment.comment_id} comment={comment} />
                ))}
              </>
            )}
             {!loading && article.comments && article.comments.length === 0 && (
                <p>Pas encore de commentaires pour cet article.</p>
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