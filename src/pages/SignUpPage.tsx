import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import axiosInstance from "../api/axiosInstance";

interface SignupResponse {
  message?: string;
}

const SignUpPage: React.FC = () => {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response: AxiosResponse<SignupResponse> = await axiosInstance.post(
        "/api/users/register/", // relative url prefix in axiosInstance (const baseURL)
        { lastname, firstname, username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        console.log("Inscription réussie !", response.data);
        navigate("/login");
      } else {
        setError(response.data?.message || "Erreur lors de l'inscription.");
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la requête d'inscription :", error);
      setError("Erreur de connexion au serveur.");
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <main className="grow flex flex-col items-center justify-center">
      <h1 className="mb-10">Inscription</h1>
      {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">{error}</p>}
      <div className="card w-[90%] md:w-[40%] lg:w-[30%] xl:w-[25%] p-6 rounded-md shadow-md bg-sky-100">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="lastname">Nom</label>
          <input
            type="text"
            id="lastname"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="firstname">Prénom</label>
          <input
            type="text"
            id="firstname"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="username">Pseudo</label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <SubmitButton />
        </div>
        <div className="text-center text-sm">
          Déjà un compte ? <a href="/login" className="hover:underline">Se connecter</a>
        </div>
      </form>
      </div>
    </main>
  );
};

export default SignUpPage;
