import { Link } from "react-router-dom";
import { Author, Tag } from "../types/api";
import { capitalizeFirstLetter } from "../utils/utils";

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
  const date = new Date(creationDate).toLocaleDateString("fr-FR");
  const url = `/articles/${articleId}`;

  // console.log("author : ", author);
  // console.log("date", date);

  return (
    <article className="card min-h-40">
      <Link to={url}>
        <h2 className="card-title hover:text-sky-950">{title}</h2>
        <p className="my-4 line-clamp-5 hover:text-sky-600">{content}</p>
      </Link>
      <h4>
        {author ? (
          <Link to={`/authors/${author.user}`} className="hover:text-sky-600">
            {author.name}
          </Link>
        ) : (
          "Inconnu"
        )}
        , {date}
      </h4>

      <Link to={url}>
        <button className="my-3 px-3 py-1 text-xl">+</button>
      </Link>

      {tags && tags.length > 0 && (
        <div>
          {/* <h2>Tags :</h2> */}
          <div>
            {tags.map((tag) => (
              <span key={tag.tag_id} className="tag">
                {capitalizeFirstLetter(tag.name)}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
