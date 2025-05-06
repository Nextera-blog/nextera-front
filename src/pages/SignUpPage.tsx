import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";

interface SignupResponse {
  message?: string;
}

const SignUpPage: React.FC = () => {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response: AxiosResponse<SignupResponse> = await axios.post(
        "http://localhost:8000/api/users/register/",
        { lastname, firstname, email, password },
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
    <div>
      <h1>Inscription</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="lastname">Nom</label>
          <input
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="firstname">Prénom</label>
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <SubmitButton />
        <div style={{ color: "red" }}>
          Déjà un compte ? <a href="/login">Se connecter</a>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
