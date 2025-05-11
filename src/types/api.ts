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