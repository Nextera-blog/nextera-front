import { useEffect, useState } from "react";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Password rules
  const passwordRequirements = [
    "Au moins 8 caractères",
    "Au moins une lettre majuscule",
    "Au moins une lettre minuscule",
    "Au moins un chiffre",
    "Au moins un caractère spécial",
  ];

  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatchError, setPasswordsMatchError] = useState<string | null>(null);

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasDigit(/\d/.test(password));
    setHasSpecialChar(/[^\w\s]/.test(password));
    if (confirmPassword && password !== confirmPassword) {
      setPasswordsMatchError("Les mots de passe ne correspondent pas.");
    } else {
      setPasswordsMatchError(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordsMatchError(null);

    if (password !== confirmPassword) {
      setPasswordsMatchError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
      setError("Le mot de passe ne respecte pas le format requis.");
      return;
    }

    try {
      const response: AxiosResponse<SignupResponse> = await axiosInstance.post(
        "/users/register/", // relative url prefix in axiosInstance (const baseURL)
        { last_name: lastname, first_name: firstname, username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        navigate("/login");
      } else {
        setError(response.data?.message || "Erreur lors de l'inscription.");
      }
    } catch (error: unknown) {
      setError("Erreur de connexion au serveur.");
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <main className="grow flex flex-col items-center justify-center">
      <h1 className="mb-10">Inscription</h1>
      {error && (
        <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">{error}</p>
      )}
      <div className="card w-[90%] md:w-[40%] lg:w-[30%] xl:w-[25%] p-6 rounded-md shadow-md bg-sky-100 mb-12">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="mb-4">
            <label className="block mb-2" htmlFor="lastname">
              Nom
            </label>
            <input
              type="text"
              id="lastname"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Champ obligatoire"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="firstname">
              Prénom
            </label>
            <input
              type="text"
              id="firstname"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Champ obligatoire"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="username">
              Pseudo
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Champ obligatoire"
              required
            />
          </div>
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
              placeholder="Champ obligatoire"
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
              placeholder="Champ obligatoire"
              required
            />
            {/* Display password rules wtih dynamic style */}
            <ul className="text-sm mt-1">
              <li className={hasMinLength ? "text-green-500" : "text-red-500"}>
                {passwordRequirements[0]}
              </li>
              <li className={hasUpperCase ? "text-green-500" : "text-red-500"}>
                {passwordRequirements[1]}
              </li>
              <li className={hasLowerCase ? "text-green-500" : "text-red-500"}>
                {passwordRequirements[2]}
              </li>
              <li className={hasDigit ? "text-green-500" : "text-red-500"}>
                {passwordRequirements[3]}
              </li>
              <li className={hasSpecialChar ? "text-green-500" : "text-red-500"}>
                {passwordRequirements[4]}
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sky-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Champ obligatoire"
              required
            />
            {passwordsMatchError && (
              <p className="text-red-500 text-sm mt-1">{passwordsMatchError}</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <SubmitButton />
          </div>
          <div className="text-center text-sm">
            Déjà un compte ?{" "}
            <a href="/login" className="underline hover:text-sky-600">
              Se connecter
            </a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUpPage;
