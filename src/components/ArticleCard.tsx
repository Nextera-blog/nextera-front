import { Link } from "react-router-dom";
import { Author, Tag } from "../types/api";

export type PostCardType = {
  articleId: number;
  title: string;
  content: string;
  creationDate: string;
  // author: {
  //   // author_id: number;
  //   user: number; // See if we choose 'user' or 'author_id'
  //   bio: string | null;
  //   join_date: string;
  //   // username: string;
  //   profile_picture_url: string | null;
  //   name?: string;
  // }
  author: Author;
  tags: Tag[];
};

export const ArticleCard = (props: PostCardType) => {
  const { articleId, title, content, author, creationDate, tags } = props;
  const date = creationDate.split("T")[0];
  const url = `/articles/${articleId}`;

  return (
    <Link to={url}>
      <article className="card min-h-40">
        <h2 className="card-title">{title}</h2>
        <p className="my-4 truncate">{content}</p>
        {/* author.usename instead of author.name */}
        <h4>
          {author ? author.name : "Inconnu"}, {date}
        </h4>

        {tags && tags.length > 0 && (
          <div>
            <h2>Tags :</h2>
            <div>
              {tags.map((tag) => (
                <span key={tag.tag_id}>{tag.name}</span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Link>
  );
};
