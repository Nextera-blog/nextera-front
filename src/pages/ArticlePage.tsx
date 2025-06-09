import { Link, useParams } from "react-router-dom";
import { Article, Tag } from "../types/api";
import {
  getAllTags,
  getArticleById,
  updateArticle,
} from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";
import CommentCard from "../components/CommentCard";
import { capitalizeFirstLetter } from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { NotificationCard } from "../components/NotificationCard";

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const {
    loading,
    error,
    data: article,
    refetch,
  } = useFetch<Article>(getArticleById, id);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalError, setModalError] = useState<boolean>(false);

  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const isAuthor = user && article?.author?.user === user.id;

  useEffect(() => {
    if (article) {
      setEditedTitle(article.title);
      setEditedContent(article.content);
      setSelectedTagIds(article.tags.map((tag) => tag.tag_id));
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [article, openModal, isEditing]);

  const handleEditClick = () => {
    // functional form of the state update, becuse otherwise, changes are sometimes not saved
    setIsEditing((prevState) => {
      return true;
    });
  };

  const handleTagClick = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
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

              <p className="mt-4 mb-2 mr-8 text-end">
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
              {article.update_date &&
                article.update_date !== article.creation_date && (
                  <p className="mb-4 mr-8 text-end">
                    Modifié le{" "}
                    {new Date(article.update_date).toLocaleDateString("fr-FR")}
                  </p>
                )}

              {isEditing && allTags.length > 0 && article?.tags && (
                <div className="mb-4 ml-8">
                  {/* <h3>Modifier les tags</h3> */}
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                      const isInitiallySelected = article.tags.some(
                        (articleTag) => articleTag.tag_id === tag.tag_id
                      );
                      return (
                        <span
                          key={tag.tag_id}
                          className={`tag cursor-pointer border-2 ${
                            selectedTagIds.includes(tag.tag_id)
                              ? "border-green-500 bg-green-100"
                              : "border-gray-400 bg-gray-100"
                          } ${isInitiallySelected ? "font-extrabold" : ""}`}
                          onClick={() => handleTagClick(tag.tag_id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleTagClick(tag.tag_id)}
                        >
                          {capitalizeFirstLetter(tag.name)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {!isEditing && article?.tags && article.tags.length > 0 && (
                <div className="mb-4 ml-8">
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
