export type Author = {
  // To be checked with the backend. BaseAuthorsSerializer is used to serialize the author in the article list and details. However, the 'Authors' model has a user field. The primary key of the authors table is in fact a user foreign key to Django's User model; the identifier we see in article.author.user is the id of the django user associated with this author
  author_id?: number; 
  user: number;
  bio: string;
  join_date: string;
  name?: string;
  profile_picture_url: string | null;
  username: string;
}

export type Article = {
  article_id: number;
  title: string;
  content: string;
  author_id: number;
  creation_date: string;
  author: Author;
}

// Below, I reproduce the order and titles of the fields defined in the backend (develop branch : c04b22e - Merge pull request #18 from Nextera-blog/feature/KAN-33/routes_authors - 2025-05-19)
export type ArticleMinimal = {
  article_id: number;
  title: string;
}

export type AuthorDetails = {
  user: number;
  name: string;
  bio: string;
  profile_picture_url: string;
  join_date: string;
  articles: ArticleMinimal[];
}