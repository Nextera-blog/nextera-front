import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

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
      const response: AxiosResponse<LoginResponse> = await axios.post(
        "http://localhost:8000/token/",
        { email: email, password: password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access}`;
        navigate("/");
        window.location.reload();
      } else {
        setError(response.data?.detail || "Identifiants incorrects.");
      }
    } catch (error: unknown) {
        console.error('Erreur lors de la requête de connexion :', error);
        setError('Erreur de connexion au serveur.');
        if (axios.isAxiosError(error) && error.response?.data?.detail) {
            setError(error.response.data.detail);
        }
    }
  };

  return (
      <main className="grow flex flex-col items-center justify-center">
        <h1 className="mb-10">Connexion</h1>
        {error && <p>{error}</p>}
        {/* <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"> */}
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
            <div style={{color: "red"}}>
              Pas de compte ? <a href="/signup">S'inscrire</a>
            </div>
          </form>
        </div>
      </main>
  );
};

export default LoginPage;
