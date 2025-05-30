import { Link, useParams } from "react-router-dom";
import { Article } from "../types/api";
import { getArticleById } from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";
import CommentCard from "../components/CommentCard";
import { capitalizeFirstLetter } from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export const ArticlePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const {
    loading,
    error,
    data: article,
  } = useFetch<Article>(getArticleById, id);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');

  const isAuthor = user && article?.author?.user === user.id;

  useEffect(() => {
    if (article) {
      setEditedTitle(article.title);
      setEditedContent(article.content);
    }
  }, [article]);

  const handleEditClick = () => {
    setIsEditing(true);
  }

  const handleSaveClick = () => {
    console.log("Sauvegarde à faire"); // TO DO : logic to save
    setIsEditing(false);
  }

  if (article) {
    console.log("Article : ", article);
  }

  console.log("user : ", user);
  
  return (
    <DataFetchingState loading={loading} error={error}>
      <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">      
        {article ? (
          <>
            <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 article-section">
              <h1 className="card-title">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                ) : (
                  article.title
                )}
              </h1>

              {isAuthor && !isEditing && (
                <button onClick={handleEditClick}>Modifier</button>
              )}              

              <p className="whitespace-pre-wrap py-8 mx-8 my-4 border-y-2 border-sky-600 grow">
                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                ) : (
                  article.content
                )}
              </p>

              <p className="my-4 mr-8 text-end">
                Publié le {new Date(article.creation_date).toLocaleDateString("fr-FR")} par{" "}
                <Link to={`/authors/${article.author.user}`} className="hover:text-sky-600">
                  {article.author.name}
                </Link>
              </p>
              {article.update_date && article.update_date !== article.creation_date && (
                <p>Modifié le {new Date(article.update_date).toLocaleDateString('fr-FR')}</p>
              )}

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

              {isEditing && (
                <div className="mt-4">
                  <button onClick={handleSaveClick} disabled={loading}>
                    Sauvegarder
                  </button>
                  <button onClick={() => setIsEditing(false)}>
                    Annuler
                  </button>
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