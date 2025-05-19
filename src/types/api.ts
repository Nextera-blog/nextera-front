export type Author = {
  author_id: number; 
  bio: string;
  join_date: string;
  name: string;
  profile_picture_url: string;
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