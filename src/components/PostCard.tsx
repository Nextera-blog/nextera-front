export type PostCardType = {
  articleId: number;
  title: string;
  content: string;
  authorId: number;
  creationDate: string;
}

export const PostCard = (props: PostCardType) => {
  const {articleId, title, content, authorId, creationDate} = props;
  const date = creationDate.split('T')[0];

  return (
    <article className="card" key={articleId}>
      <h2 className="card-title">{title}</h2>
      <p className="p-2 my-2">{content}</p>
      <h4>Auteur {authorId}, {date}</h4>
    </article>
  )
}