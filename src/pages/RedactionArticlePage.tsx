export const RedactionArticlePage: React.FunctionComponent = () => {
  return (
    <main className="grow flex flex-col items-center h-5/6 overflow-hidden">
      <h1>Rédiger un article</h1>

      <section className="card w-5/6 md:w-1/2 md:mt-2 mb-6 grow p-4 md:p-8 md:max-h-full">
        <h2 className="text-center mb-6">Nouvel article</h2>
        <form action="POST" className="flex flex-col h-full">
          <label htmlFor="title self-start">Titre de l'article</label>
          <input type="text" name="title" className="md:p-3" />

          <label htmlFor="content">Contenu de l'article</label>
          <textarea name="content" id="content" className="h-32 md:h-1/3 md:max-h-1/2 overflow-y-scroll"></textarea>

          <label htmlFor="author_name">Nom de l'auteur</label>
          <input type="text" className="md:p-3" />

          <label htmlFor="date">Date de création</label>
          <input type="date" name="creation_date" id="creation_date" defaultValue={`${Date.now}`} className="md:p-3" />

          <button className="self-center md:mb-3">Valider</button>
        </form>
      </section>
    </main>
  );
};
