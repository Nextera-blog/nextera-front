import axios from "axios";
import { Article } from "../types/api";

/**
 * Get the articles list
 * @param setArticles useState - setArticles list with the fulfilled request response
 */
export async function getArticles(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>
) {
  await axios
    .get("http://localhost:8000/articles")
    .then((res) => setArticles(res.data))
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .finally(() => setLoading(false));
}

export const createArticle = (
  title: string,
  content: string,
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  async function postArticle() {
    try {
      const response = await axios.post(
        "http://localhost:8000/articles/create/",
        { title, content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("L'article a bien été créé.");
      }
    } catch (error: any) {
      setError(true);

      if (error.status === 401) {
        setMessage("Action non autorisée.");
      } else {
        setMessage(
          error.response?.data?.message || "Erreur lors de la création."
        );
      }
    }
  };

  postArticle();
}
