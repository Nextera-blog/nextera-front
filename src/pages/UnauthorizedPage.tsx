import { Link } from "react-router-dom";

export const UnauthorizedPage: React.FC = () => {
  return (
    <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
        <section className="card grow m-6 overflow-y-auto-scroll flex flex-col md:w-4/5 article-section">
      <h1>Accès non autorisé</h1>
      <div className="whitespace-pre-wrap py-20 mx-8 my-4 text-center border-y-2 border-sky-600 grow">
        <p>Vous n'avez pas l'autorisation d'accéder à cette page.</p>
        <p className="mt-5">Merci de retourner à la <Link to="/" className="text-sky-600 hover:underline">page d'accueil.</Link></p>
      </div>
      </section>
    </main>
  );
};
