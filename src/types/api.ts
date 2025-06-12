export type Author = {
  // To be checked with the backend. BaseAuthorsSerializer is used to serialize the author in the article list and details. However, the 'Authors' model has a user field. The primary key of the authors table is in fact a user foreign key to Django's User model; the identifier we see in article.author.user is the id of the django user associated with this author
  // author_id?: number; 
  user: number;
  name?: string; // ! TO CHECK
  bio: string | null;
  profile_picture_url: string | null;
  join_date: string;
  // username: string;
}

export type Comment = {
  comment_id: number;
  content: string;
  creation_date: string;
  update_date: string;
  user: Author;
  article: number, // TO SEE : not article_id ?
  parent_comment: number | null;
  comment_reactions: Reaction[]; // Not implemented
  comment_replies: Comment[];
}

export type NewComment = {
  content: string;
  user: number;
  article: number;
  parent_comment: number | null;
}

export interface PaginatedComments {
  count: number;
  next: string | null;
  previous: string | null;
  results: Comment[];
}

export type Tag = {
  tag_id: number;
  name: string;
}

export type Article = {
  article_id: number;
  title: string;
  content: string;
  creation_date: string;
  update_date: string;
  // author_id: number;
  author: Author;
  tags: Tag[];
  // comments: Comment[];
  comments: PaginatedComments;
  article_reactions?: Reaction[];
}

export type ArticleMinimal = {
  article_id: number;
  title: string;
}

export type AuthorDetails = {
  user: number;
  name: string;
  bio: string | null;
  profile_picture_url: string | null;
  join_date: string;
  articles: ArticleMinimal[];
}

export type CurrentUser = {
  // is_superuser is missing in the API response at /users/current/
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  author: Author;
  role: {
    role_id: number;
    role_name: string;
  } | null;
}

export type Reaction = {
  reaction_type_id: number;
  emoji: string;
  description: string;
  counter: number;
}

// export type ArticleWithReactions = Article & {
//   article_reactions?: Reaction[]; // TO SEE : maybe just adding this line to Article type ?
// }

export type PaginatedArticles = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
};