import { useState } from "react";
import { Comment } from "../types/api";

const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);

  const formattedDate = new Date(comment.creation_date).toLocaleDateString("fr-FR"); 

  const hasReplies = comment.comment_replies.length > 0;

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className="mb-4 p-3 border rounded-md">
      <p className="font-semibold">{comment.user.name} <span className="font-normal">({formattedDate})</span></p>
      <p className="whitespace-pre-wrap">{comment.content}</p>
      {hasReplies && (
        <div className="mt-2">
          <button onClick={toggleReplies}>
            {comment.comment_replies.length} réponse{comment.comment_replies.length > 1 ? 's' : ''}
          </button>
          {showReplies && (
            <div className="ml-6 mt-2">
              {comment.comment_replies.map(reply => (
                <CommentCard key={reply.comment_id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
