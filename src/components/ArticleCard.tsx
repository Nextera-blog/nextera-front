import { Link } from "react-router-dom";
import { Author, Reaction, Tag } from "../types/api";
import { capitalizeFirstLetter } from "../utils/utils";

export type PostCardType = {
  articleId: number;
  title: string;
  content: string;
  creationDate: string;
  author: Author;
  tags: Tag[];
  article_reactions?: Reaction[];
};

export const ArticleCard = (props: PostCardType) => {
  const {
    articleId,
    title,
    content,
    author,
    creationDate,
    tags,
    article_reactions,
  } = props;
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
          <Link to={`/authors/${author.user}`} className="link link:hover">
            {author.name}
          </Link>
        ) : (
          "Inconnu"
        )}
        , {date}
      </h4>

      <div className="flex justify-between items-center">
        <Link to={url}>
          <button className="my-3 px-3 py-1 text-xl">+</button>
        </Link>

        <div className="flex ml-4">
          {article_reactions &&
            article_reactions.map((reaction) => (
              <div
                key={reaction.reaction_type_id}
                className="flex flex-col items-center justify-center"
              >
                {reaction.counter > 0 && (
                  <>
                    <div className="mt-3 text-lg">{reaction.emoji}</div>
                    <div className="-mt-2 text-sm">{reaction.counter}</div>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>

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
