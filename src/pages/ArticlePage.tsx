import { Link, useParams } from "react-router-dom";
import { Article, Reaction } from "../types/api";
import { getArticleById } from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";
import CommentCard from "../components/CommentCard";
import { capitalizeFirstLetter } from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { NotificationCard } from "../components/NotificationCard";
import { ArticleReactionResult, toggleArticleReaction } from "../services/reactions";

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const {
    loading,
    error,
    data: initialArticle,
    refetch,
  } = useFetch<Article>(getArticleById, id);

  const { isLoggedIn, user } = useAuth();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<boolean>(false);
  const [localReactions, setLocalReactions] = useState<Reaction[] | undefined>(
    initialArticle?.article_reactions
  );

  console.log("useAuth() : ", useAuth());
  console.log("initialArticle : ", initialArticle);

  // if (article) {
  //   console.log("Article : ", article);
  //   console.log("article?.article_reactions : ", article?.article_reactions);
  // }

  useEffect(() => {
    setLocalReactions(initialArticle?.article_reactions);
  }, [initialArticle]);

  const updateLocalReactions = (
    reactionTypeId: number,
    operation: "increment" | "decrement"
  ) => {
    if (localReactions) {
      setLocalReactions((prevReactions) =>
        prevReactions?.map((reaction) =>
          reaction.reaction_type_id === reactionTypeId
            ? {
                ...reaction,
                counter:
                  operation === "increment"
                    ? reaction.counter + 1
                    : Math.max(0, reaction.counter - 1),
              }
            : reaction
        )
      );
    }
  };

  const handleReactionClick = async (reactionId: number) => {
    if (user && initialArticle && user.id === initialArticle.author.user) {
      setMessage("Vous ne pouvez pas réagir à votre propre article.");
      setNotificationError(true);
      setOpenModal(true);
      setTimeout(() => {
        setOpenModal(false);
        setMessage(null);
        setNotificationError(false);
      }, 4000);
      return;
    }

    if (isLoggedIn && initialArticle && user?.id) {
      // console.log(`Emoji ${reactionId} cliqué !`);
      try {
        const response: ArticleReactionResult = await toggleArticleReaction(
          reactionId,
          user.id,
          initialArticle.article_id,
        );
        console.log("Réponse de la réaction :", response);

        if (
          "message" in response &&
          response.message === "Réaction supprimée avec succès"
        ) {
          updateLocalReactions(reactionId, "decrement");
        } else if ("reaction_type" in response) {
          const hasReactedBefore = localReactions?.some(
            (r) => r.reaction_type_id === reactionId
          );
          updateLocalReactions(
            reactionId,
            hasReactedBefore ? "increment" : "increment"
          );
        }

        refetch();
      } catch (error: any) {
        console.error("Erreur lors de la réaction :", error.message);
        setMessage("Erreur lors de la réaction.");
        setNotificationError(true);
        setOpenModal(true);
        setTimeout(() => {
          setOpenModal(false);
          setMessage(null);
          setNotificationError(false);
        }, 4000);
      }
    } else {
      setOpenModal(true);
      setMessage("Connectez-vous pour laisser une réaction.");
      setNotificationError(false);
      // console.log("Connectez-vous pour laisser une réaction.");
      setTimeout(() => {
        setOpenModal(false);
        setMessage(null);
      }, 4000);
    }
  };

  const isAuthor = user && initialArticle && user.id === initialArticle.author.user;

  console.log("user?.id : ", user?.id);
  console.log("initialArticle?.author.user : ", initialArticle?.author.user);

  return (
    <DataFetchingState loading={loading} error={error}>
      <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
        {openModal && (
          <NotificationCard
            message={message}
            error={notificationError}
            openModal={openModal}
          />
        )}

        {initialArticle ? (
          <>
            <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 article-section">
              <h1 className="card-title">{initialArticle.title}</h1>
              <p className="whitespace-pre-wrap py-8 mx-8 my-4 border-y-2 border-sky-600 grow">
                {initialArticle.content}
              </p>

              <div className="flex justify-between items-center mx-8 mb-4">
                <div className="flex ml-0">
                  {initialArticle?.article_reactions &&
                    initialArticle.article_reactions.map((reaction) => (
                      <div
                        className={`flex flex-col items-center justify-center mr-4 ${isAuthor ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        key={reaction.reaction_type_id}
                        onClick={() => !isAuthor && handleReactionClick(reaction.reaction_type_id)}
                      >
                        <div className="mt-3 text-lg transition-transform duration-200 hover:scale-200 origin-center">
                          {reaction.emoji}
                        </div>
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
                  {new Date(initialArticle.creation_date).toLocaleDateString(
                    "fr-FR"
                  )}{" "}
                  par{" "}
                  <Link
                    to={`/authors/${initialArticle.author.user}`}
                    className="hover:text-sky-600"
                  >
                    {initialArticle.author.name}
                  </Link>
                </p>
              </div>

              {initialArticle.tags && initialArticle.tags.length > 0 && (
                <div className="mx-8 mb-4">
                  <div>
                    {initialArticle.tags.map((tag) => (
                      <span key={tag.tag_id} className="tag">
                        {capitalizeFirstLetter(tag.name)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
            <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 comments-section">
              {initialArticle.comments &&
                initialArticle.comments.length > 0 && (
                  <>
                    <h2 className="mb-4">Commentaires</h2>
                    {initialArticle.comments.map((comment) => (
                      <CommentCard key={comment.comment_id} comment={comment} />
                    ))}
                  </>
                )}
              {!loading &&
                initialArticle.comments &&
                initialArticle.comments.length === 0 && (
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
