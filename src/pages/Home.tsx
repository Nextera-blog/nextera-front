import { useState } from "react";
import { PostCard } from "../components/PostCard";
import { apiRequest } from "../hooks/apiRequest";

export const Home = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const posts = [{article_id: 1, title: "Le minimalisme numérique", content: "Le mininimalisme numérique consiste à réduire la surcharge digitale...", creation_date: "2025-05-05T17:29:49+02:00", author_id: 2}];
  // const posts = apiRequest('list', setLoading); A TERMINER

  if (loading) {
    return <main className="p-4 flex justify-center items-center grow">
      <p>Récupération des posts</p>
      <p className="animate-bounce ml-2">. . .</p>
    </main>
  }

  return (
    <main className="p-4 flex flex-col items-center grow">
      <h1 className="mb-10">Bienvenue sur Nextera Blog !</h1>

      <section className="w-7xl grid grid-cols-2 gap-12">
        {posts.map((post) => {
          return <PostCard articleId={post.article_id} title={post.title} content={post.content} authorId={post.author_id} creationDate={post.creation_date} />
        })}
      </section>
    </main>
  )
}