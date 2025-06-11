import { Link, useParams } from "react-router-dom";
import { Article, Reaction, Tag } from "../types/api";
import { getAllTags, getArticleById, updateArticle } from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";
import CommentCard from "../components/CommentCard";
import { capitalizeFirstLetter } from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { NotificationCard } from "../components/NotificationCard";
import { ArticleReactionResult, toggleArticleReaction } from "../services/reactions";
import ReactPaginate from "react-paginate";
import { NewCommentCard } from "../components/NewCommentCard";

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const {
    loading,
    error,
    data: article,
    refetch,
  } = useFetch<Article>(getArticleById, id, currentCommentPage);

  const { isLoggedIn, user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [localReactions, setLocalReactions] = useState<Reaction[]>([]);
  const [activeUserReaction, setActiveUserReaction] = useState<number | null>(
    null
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalError, setModalError] = useState<boolean>(false);

  const isAuthor = user && article?.author?.user === user.id;

  useEffect(() => {
    if (article) {
      setEditedTitle(article.title);
      setEditedContent(article.content);
      setSelectedTagIds(article.tags.map((tag) => tag.tag_id));

      if (article.article_reactions) {
        setLocalReactions(article.article_reactions.map((r) => ({ ...r })));
      }
    }

    const fetchAllTags = async () => {
      try {
        const tags = await getAllTags();
        setAllTags(tags);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération de tous les tags : ",
          err
        );
        setModalMessage("Erreur lors du chargement des tags.");
        setModalError(true);
        setOpenModal(true);
      }
    };

    if (isEditing) {
      fetchAllTags();
    } else {
      setAllTags([]);
    }

    if (openModal) {
      const timer = setTimeout(() => {
        setOpenModal(false);
        setModalMessage(null);
        setModalError(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [article, openModal, isEditing]);

  const comments = article?.comments?.results || [];
  const commentPageCount = article?.comments
    ? Math.ceil(article.comments.count / 5)
    : 0; // 5 comments per page (cf. backend)

  const handleCommentPageClick = (event: { selected: number }) => {
    setCurrentCommentPage(event.selected + 1); // react-paginate uses a base index of 0, the API a base index of 1
  };

  const handleEditClick = () => {
    // functional form of the state update, becuse otherwise, changes are sometimes not saved
    setIsEditing((prevState) => {
      return true;
    });
  };

  const handleTagClick = (tagId: number) => {
    setSelectedTagIds((prevSelectedTagIds) => {
      if (prevSelectedTagIds.includes(tagId)) {
        return prevSelectedTagIds.filter((id) => id !== tagId);
      } else {
        return [...prevSelectedTagIds, tagId];
      }
    });
  };

  const handleSaveClick = async () => {
    if (!article?.article_id) return;
    setIsSaving(true);
    setModalMessage(null);
    setModalError(false);
    setOpenModal(false);

    try {
      await updateArticle(
        article.article_id,
        editedTitle,
        editedContent,
        user?.id,
        article.author.name,
        article.author.bio,
        article.author.profile_picture_url,
        article.author.join_date,
        selectedTagIds
      );
      setModalMessage("Article mis à jour avec succès !");
      setModalError(false);
      setOpenModal(true);
      setIsEditing(false);
      refetch();
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour de l'article : ", err);
      setModalMessage(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour de l'article."
      );
      setModalError(true);
      setOpenModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  const updateLocalReactionsCounters = (
    oldReactionTypeId: number | null,
    newReactionTypeId: number | null
  ) => {
    setLocalReactions((prevReactions) => {
      const updatedReactions = [...prevReactions];

      if (oldReactionTypeId !== null) {
        const oldReactionIndex = updatedReactions.findIndex(
          (r) => r.reaction_type_id === oldReactionTypeId
        );
        if (oldReactionIndex > -1) {
          updatedReactions[oldReactionIndex] = {
            ...updatedReactions[oldReactionIndex],
            counter: Math.max(
              0,
              updatedReactions[oldReactionIndex].counter - 1
            ),
          };
        }
      }

      if (newReactionTypeId !== null) {
        const newReactionIndex = updatedReactions.findIndex(
          (r) => r.reaction_type_id === newReactionTypeId
        );
        if (newReactionIndex > -1) {
          updatedReactions[newReactionIndex] = {
            ...updatedReactions[newReactionIndex],
            counter: updatedReactions[newReactionIndex].counter + 1,
          };
        } else if (article) {
          const baseReaction = article.article_reactions?.find(
            (r) => r.reaction_type_id === newReactionTypeId
          );
          if (baseReaction) {
            const tempReactions = [
              ...updatedReactions,
              { ...baseReaction, counter: 1 },
            ];
            tempReactions.sort(
              (a, b) => a.reaction_type_id - b.reaction_type_id
            );
            return tempReactions;
          }
        }
      }
      return updatedReactions;
    });
  };

  const handleReactionClick = async (clickedReactionTypeId: number) => {
    if (isAuthor) {
      setModalMessage("Vous ne pouvez pas réagir à votre propre article.");
      setModalError(true);
      setOpenModal(true);
      //       setTimeout(() => {
      //         setOpenModal(false);
      //         setModalMessage(null);
      //         setModalError(false);
      //       }, 4000);
      return;
    }

    if (!isLoggedIn || !article || !user?.id) {
      setOpenModal(true);
      setModalMessage("Connectez-vous pour laisser une réaction.");
      setModalError(false);
      //       setTimeout(() => {
      //         setOpenModal(false);
      //         setModalMessage(null);
      //       }, 4000);
      return;
    }

    // Save previous state for possible cancellation
    const prevLocalReactions = localReactions;
    const prevActiveUserReaction = activeUserReaction;

    let newActiveUserReaction: number | null;
    //     let reactionToApi: number | null;

    if (clickedReactionTypeId === activeUserReaction) {
      newActiveUserReaction = null;
      //       reactionToApi = clickedReactionTypeId;
      updateLocalReactionsCounters(activeUserReaction, null);
    } else {
      newActiveUserReaction = clickedReactionTypeId;
      //       reactionToApi = clickedReactionTypeId;
      updateLocalReactionsCounters(activeUserReaction, clickedReactionTypeId);
    }

    setActiveUserReaction(newActiveUserReaction);

    try {
      const response: ArticleReactionResult = await toggleArticleReaction(
        clickedReactionTypeId,
        user.id,
        article.article_id
      );

      console.log("Réponse de la réaction :", response);
    } catch (err: any) {
      console.error("Erreur lors de la réaction :", err.message);
      // In case of error, cancel optimistic updates
      setLocalReactions(prevLocalReactions);
      setActiveUserReaction(prevActiveUserReaction);

      setModalMessage("Erreur lors de la réaction.");
      setModalError(true);
      setOpenModal(true);
      //       setTimeout(() => {
      //         setOpenModal(false);
      //         setModalMessage(null);
      //         setModalError(false);
      //       }, 4000);
    }
  };

  //   console.log("user?.id : ", user?.id);
  //   console.log("initialArticle?.author.user : ", initialArticle?.author.user);

  return (
    <DataFetchingState loading={loading} error={error}>
      <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
        {openModal && (
          <NotificationCard
            message={modalMessage}
            error={modalError}
            openModal={openModal}
          />
        )}

        {article ? (
          <>
            <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 article-section">
              <div className="mx-4">
                <h1 className="card-title">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="input-h1-title"
                    />
                  ) : (
                    article.title
                  )}
                </h1>
              </div>

              {isAuthor && !isEditing && (
                <div className="flex justify-center">
                  <button onClick={handleEditClick} className="modify">
                    Modifier
                  </button>
                </div>
              )}

              {isAuthor && isEditing && (
                <div className="flex justify-center">
                  <button className="modify" disabled>
                    Vous êtes en mode édition
                  </button>
                </div>
              )}

              <div className="py-8 mx-8 my-4 border-y-2 border-sky-600 grow">
                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="whitespace-pre-wrap w-full h-full font-mono text-lg color-sky-950 bg-sky-200 border-none box-border"
                    style={{ minHeight: "100px" }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{article.content}</p>
                )}
              </div>

              <div className="flex justify-between items-center mx-8 mb-4">
                <div className="flex ml-0">
                  {localReactions &&
                    localReactions.map((reaction) => (
                      <div
                        className={`flex flex-col items-center justify-center mr-4 
                                    ${
                                      isAuthor
                                        ? "cursor-not-allowed opacity-50"
                                        : "cursor-pointer"
                                    }
                                    ${
                                      activeUserReaction ===
                                      reaction.reaction_type_id
                                        ? "text-sky-500"
                                        : "text-sky-950"
                                    }`}
                        key={reaction.reaction_type_id}
                        onClick={() =>
                          !isAuthor &&
                          handleReactionClick(reaction.reaction_type_id)
                        }
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

              {article.update_date &&
                article.update_date !== article.creation_date && (
                  <p className="mb-4 mr-8 text-end">
                    Modifié le{" "}
                    {new Date(article.update_date).toLocaleDateString("fr-FR")}
                  </p>
                )}

              {isEditing && allTags.length > 0 && article?.tags && (
                <div className="mb-4 ml-8">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                      return (
                        <span
                          key={tag.tag_id}
                          className={`tag cursor-pointer border-2 ${
                            selectedTagIds.includes(tag.tag_id)
                              ? "border-green-500 bg-green-100"
                              : "border-gray-400 bg-gray-100"
                          }`}
                          onClick={() => handleTagClick(tag.tag_id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleTagClick(tag.tag_id)
                          }
                        >
                          {capitalizeFirstLetter(tag.name)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {!isEditing && article?.tags && article.tags.length > 0 && (
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

              {isEditing && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    className="save"
                  >
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="abort">
                    Annuler
                  </button>
                </div>
              )}
            </section>

            <NewCommentCard articleId={article.article_id} />

            <section className="card grow m-6 overflow-y-auto flex flex-col md:w-4/5 comments-section">
              {comments.length > 0 ? (
                <>
                  <h2 className="mb-4">Commentaires</h2>
                  {comments.map((comment) => (
                    <CommentCard key={comment.comment_id} comment={comment} />
                  ))}
                  {commentPageCount > 1 && (
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel="next >"
                      onPageChange={handleCommentPageClick}
                      pageRangeDisplayed={5}
                      pageCount={commentPageCount}
                      previousLabel="< previous"
                      renderOnZeroPageCount={null}
                      containerClassName="pagination"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      activeClassName="active"
                      forcePage={currentCommentPage - 1}
                    />
                  )}
                </>
              ) : (
                !loading && <p>Pas encore de commentaires pour cet article.</p>
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
