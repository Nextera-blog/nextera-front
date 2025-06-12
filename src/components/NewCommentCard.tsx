import React from "react";
import { createComment } from "../services/articles";
import { useAuth } from "../contexts/AuthContext";
import { NewComment } from "../types/api";

export type NewCommentProps = {
  articleId: number;
  parentCommentId: number | null;
}

export const NewCommentCard:React.FunctionComponent<NewCommentProps> = ({articleId, parentCommentId}) => {  
  const { user } = useAuth();
  const userId = user?.id;

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("content") as string;
    const comment: NewComment = {
      article: articleId,
      content: content,
      parent_comment: parentCommentId || null,
      user: userId as number,
    }

    if (comment && comment !== null) {
      createComment(comment);
    }
  }
  if (userId) {
    return (
      <section className="card h-fit-content">
        <p className="mb-2 ml-2">Nouveau commentaire :</p>
  
        <form className="grid grid-cols-6 gap-2 w-full" action="" method="POST" onSubmit={handleSubmitComment}>
          <input type="text" className="col-start-1 col-end-6 col-span-4" name="content"/>
          <button type="submit" className="col-start-6 col-end-6 justify-self-center">Ajouter</button>
        </form>
      </section>
    )
  }
}