import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response: AxiosResponse<LoginResponse> = await axiosInstance.post(
        "/token/", // relative url prefix in axiosInstance (const baseURL)
        { email: email, password: password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Réponse du serveur (succès) :", response);

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        // authorization header managed by the axios interceptor;
        navigate("/");
        window.location.reload();
      } else {
        setError(response.data?.detail || "Identifiants incorrects.");
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la requête de connexion :", error);
      let errorMessage = "Erreur de connexion au serveur.";
      if (axios.isAxiosError(error) && error.response) {
        console.log("Réponse du serveur (erreur) :", error.response);
        if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      }
      setError(errorMessage);
    }
  };

  return (
    <main className="grow flex flex-col items-center justify-center">
      <h1 className="mb-10">Connexion</h1>
      {error && <p>{error}</p>}
      <div className="card w-[40%]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <SubmitButton />
          </div>
          <div style={{ color: "red" }}>
            Pas de compte ? <a href="/signup">S'inscrire</a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
