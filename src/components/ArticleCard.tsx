import { Link } from "react-router-dom";

export type PostCardType = {
  articleId: number;
  title: string;
  content: string;
  creationDate: string;
  author: {
    // author_id: number;
    user: number; // See if we choose 'user' or 'author_id' 
    bio: string | null;
    join_date: string;
    // username: string;
    profile_picture_url: string | null;
    name?: string;
  }
}

export const ArticleCard = (props: PostCardType) => {
  const {articleId, title, content, author, creationDate} = props;
  const date = creationDate.split('T')[0];
  const url = `/articles/${articleId}`;

  return (
    <Link to={url}>
      <article className="card min-h-40">
        <h2 className="card-title">{title}</h2>
        <p className="my-4 truncate">{content}</p>
        {/* author.usename instead of author.name */}
        <h4>{author ? author.name : "Inconnu"}, {date}</h4>
      </article>
    </Link>
  )
}