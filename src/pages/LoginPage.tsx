import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

interface LoginResponse {
  access: string;
  refresh: string;
  detail?: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response: AxiosResponse<LoginResponse> = await axiosInstance.post(
        "/token/", // relative url prefix in axiosInstance (const baseURL)
        { email: email, password: password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        login(response.data.access, response.data.refresh);
        navigate("/");
      } else {
        setError(response.data?.detail || "Identifiants incorrects.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          setError("Identifiants incorrects.")
        } else {
          setError("Erreur de connexion au serveur.");
        }
      } else {
        setError("Erreur de connexion au serveur.");
      }
    }
  };

  return (
    <main className="grow flex flex-col items-center justify-center">
      <h1 className="mb-10">Connexion</h1>
      {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">{error}</p>}
      <div className="card w-[90%] md:w-[40%] lg:w-[30%] xl:w-[25%] px-6 py-10 shadow-md bg-sky-100">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <SubmitButton />
          </div>
          <div className="text-center text-sm">
            Pas de compte ? <a href="/signup" className="underline hover:text-sky-600">S'inscrire</a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;