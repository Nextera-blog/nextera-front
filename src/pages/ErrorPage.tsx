import { Footer } from "../components/Footer"
import { Header } from "../components/Header"

export const ErrorPage = () => {
  return (
    <div className="w-full h-full bg-sky-950 text-sky-50 flex flex-col">
      <Header />
      <main className="p-4 flex flex-col items-center grow h-full overflow-hidden">
        <h1>Erreur 404</h1>
        <div className="flex flex-col justify-center items-center h-1/2">
          <p>Une erreur est survenue...</p>
          <p className="mt-5">Merci de retourner à la page d'accueil.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
