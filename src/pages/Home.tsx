export const Home = () => {
  const posts = [{article_id: 1, title: "Le minimalisme numérique", content: "Le mininimalisme numérique consiste à réduire la surcharge digitale...", creation_date: "2025-05-05T17:29:49+02:00", author_id: 2}];

  return (
    <main className="p-4 flex flex-col items-center">
      <h1 className="mb-10">Bienvenue sur Nextera Blog !</h1>

      <section className="w-7xl grid grid-cols-2 gap-12">
        {posts.map((post) => {
          const date = post.creation_date.split('T')[0];

          return <article className="card" key={post.article_id}>
            <h2 className="card-title">{post.title}</h2>
            <p className="p-2">{post.content}</p>
            <h4>Auteur {post.author_id}, {date}</h4>
          </article>
        }
        )}
      </section>
    </main>
  )
}