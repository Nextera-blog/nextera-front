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
    // refetch,
  } = useFetch<Article>(getArticleById, id);

  const { isLoggedIn, user } = useAuth();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<boolean>(false);
  const [localReactions, setLocalReactions] = useState<Reaction[]>([]);
  const [activeUserReaction, setActiveUserReaction] = useState<number | null>(null);

  console.log("useAuth() : ", useAuth());
  console.log("initialArticle : ", initialArticle);

  // if (article) {
  //   console.log("Article : ", article);
  //   console.log("article?.article_reactions : ", article?.article_reactions);
  // }

  useEffect(() => {
    if (initialArticle?.article_reactions) {
      setLocalReactions(initialArticle.article_reactions.map(r => ({ ...r })));
    }
  }, [initialArticle]);

  const updateLocalReactionsCounters = (
    oldReactionTypeId: number | null,
    newReactionTypeId: number | null
  ) => {
    setLocalReactions(prevReactions => {
      const updatedReactions = [...prevReactions];

      if (oldReactionTypeId !== null) {
        const oldReactionIndex = updatedReactions.findIndex(r => r.reaction_type_id === oldReactionTypeId);
        if (oldReactionIndex > -1) {
          updatedReactions[oldReactionIndex] = {
            ...updatedReactions[oldReactionIndex],
            counter: Math.max(0, updatedReactions[oldReactionIndex].counter - 1)
          };
        }
      }

      if (newReactionTypeId !== null) {
        const newReactionIndex = updatedReactions.findIndex(r => r.reaction_type_id === newReactionTypeId);
        if (newReactionIndex > -1) {
          updatedReactions[newReactionIndex] = {
            ...updatedReactions[newReactionIndex],
            counter: updatedReactions[newReactionIndex].counter + 1
          };
        } else if (initialArticle) {
          const baseReaction = initialArticle.article_reactions?.find(r => r.reaction_type_id === newReactionTypeId);
          if (baseReaction) {
            const tempReactions = [...updatedReactions, { ...baseReaction, counter: 1 }];
            tempReactions.sort((a, b) => a.reaction_type_id - b.reaction_type_id);
            return tempReactions;
          }
        }
      }
      return updatedReactions;
    });
  };

  const handleReactionClick = async (clickedReactionTypeId: number) => {
    const isAuthor = user && initialArticle && user.id === initialArticle.author.user;
    if (isAuthor) {
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

    if (!isLoggedIn || !initialArticle || !user?.id) {
      setOpenModal(true);
      setMessage("Connectez-vous pour laisser une réaction.");
      setNotificationError(false);
      setTimeout(() => {
        setOpenModal(false);
        setMessage(null);
      }, 4000);
      return;
    }

    // Save previous state for possible cancellation
    const prevLocalReactions = localReactions;
    const prevActiveUserReaction = activeUserReaction;

    let newActiveUserReaction: number | null;
    let reactionToApi: number | null;

    if (clickedReactionTypeId === activeUserReaction) {
      newActiveUserReaction = null;
      reactionToApi = clickedReactionTypeId;
      updateLocalReactionsCounters(activeUserReaction, null);
    } else {
      newActiveUserReaction = clickedReactionTypeId;
      reactionToApi = clickedReactionTypeId;
      updateLocalReactionsCounters(activeUserReaction, clickedReactionTypeId);
    }

    setActiveUserReaction(newActiveUserReaction);

    try {
      const response: ArticleReactionResult = await toggleArticleReaction(
        clickedReactionTypeId,
        user.id,
        initialArticle.article_id,
      );

      console.log("Réponse de la réaction :", response);

    } catch (error: any) {
      console.error("Erreur lors de la réaction :", error.message);
      // In case of error, cancel optimistic updates
      setLocalReactions(prevLocalReactions);
      setActiveUserReaction(prevActiveUserReaction);

      setMessage("Erreur lors de la réaction.");
      setNotificationError(true);
      setOpenModal(true);
      setTimeout(() => {
        setOpenModal(false);
        setMessage(null);
        setNotificationError(false);
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
                  {localReactions &&
                    localReactions.map((reaction) => (
                      <div
                        className={`flex flex-col items-center justify-center mr-4 
                                    ${isAuthor ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                    ${activeUserReaction === reaction.reaction_type_id ? 'text-sky-500' : 'text-sky-950'}`}
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
