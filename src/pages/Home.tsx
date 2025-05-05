export const Home = () => {
  return (
    <main className="p-4 flex flex-col items-center">
      <h1 className="mb-10">Bienvenue sur Nextera Blog !</h1>

      <section className="w-7xl grid grid-cols-2 gap-12">
        <article className="card">
          <h2 className="card-title">Titre</h2>
          <p className="p-2">Description (short)</p>
          <h4>Auteur, date</h4>
        </article>
      </section>
    </main>
  )
}