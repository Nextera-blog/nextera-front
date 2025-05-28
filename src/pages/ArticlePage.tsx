import { Link, useParams } from "react-router-dom";
import { Article, Reaction } from "../types/api";
import { getArticleById } from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";
import CommentCard from "../components/CommentCard";
import { capitalizeFirstLetter } from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { NotificationCard } from "../components/NotificationCard";

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const {
    loading,
    error,
    data: article,
  } = useFetch<Article>(getArticleById, id);

  const { isLoggedIn } = useAuth();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<boolean>(false);

  // if (article) {
  //   console.log("Article : ", article);
  //   console.log("article?.article_reactions : ", article?.article_reactions);
  // }

  const handleReactionClick = (reactionId: number) => {
    if (isLoggedIn) {
      console.log(`Emoji ${reactionId} cliqué !`); // TO DO : handle API to add/delete the reaction
    } else {
      setOpenModal(true);
      setMessage("Connectez-vous pour laisser une réaction.");
      setNotificationError(false);
      console.log("Connectez-vous pour laisser une réaction.");
        setTimeout(() => {
          setOpenModal(false);
          setMessage(null);
        }, 4000);
    }
  };

  return (
    <DataFetchingState loading={loading} error={error}>
      <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
        {openModal && <NotificationCard message={message} error={notificationError} openModal={openModal} />}

        {article ? (
          <>
            <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 article-section">
              <h1 className="card-title">{article.title}</h1>
              <p className="whitespace-pre-wrap py-8 mx-8 my-4 border-y-2 border-sky-600 grow">
                {article.content}
              </p>

              <div className="flex justify-between items-center mx-8 mb-4">
                <div className="flex ml-0">
                  {article?.article_reactions &&
                    article?.article_reactions.map((reaction) => (
                      <div
                        className="flex flex-col items-center justify-center mr-4"
                        key={reaction.reaction_type_id}
                        onClick={() =>
                          handleReactionClick(reaction.reaction_type_id)
                        }
                      >
                        <div className="mt-3 text-lg">{reaction.emoji}</div>
                        <div
                          className={`text-sm ${
                            reaction.counter === 0 ? "text-sky-200" : ""
                          }`}
                        >
                          {reaction.counter}
                        </div>
                      </div>
                    ))}
                </div>
                <p className="my-4 text-right">
                  Publié le{" "}
                  {new Date(article.creation_date).toLocaleDateString("fr-FR")}{" "}
                  par{" "}
                  <Link
                    to={`/authors/${article.author.user}`}
                    className="hover:text-sky-600"
                  >
                    {article.author.name}
                  </Link>
                </p>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="mx-8 mb-4">
                  <div>
                    {article.tags.map((tag) => (
                      <span key={tag.tag_id} className="tag">
                        {capitalizeFirstLetter(tag.name)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
            <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 comments-section">
              {article.comments && article.comments.length > 0 && (
                <>
                  <h2 className="mb-4">Commentaires</h2>
                  {article.comments.map((comment) => (
                    <CommentCard key={comment.comment_id} comment={comment} />
                  ))}
                </>
              )}
              {!loading &&
                article.comments &&
                article.comments.length === 0 && (
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
