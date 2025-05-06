import { Link } from "react-router-dom";

export type PostCardType = {
  articleId: number;
  title: string;
  content: string;
  authorId: number;
  creationDate: string;
  author: {
    author_id: number; 
    bio: string;
    join_date: string;
    name: string;
    profile_picture_url: string;
  }
}

export const ArticleCard = (props: PostCardType) => {
  const {articleId, title, content, author, creationDate} = props;
  const date = creationDate.split('T')[0];
  const url = `/posts/${articleId}`;

  return (
    <Link to={url}>
      <article className="card h-40">
        <h2 className="card-title">{title}</h2>
        <p className="p-2 my-2 truncate">{content}</p>
        <h4>{author.name}, {date}</h4>
      </article>
    </Link>
  )
}