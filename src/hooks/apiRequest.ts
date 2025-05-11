import axios from "axios";
import { Article } from "../types/api";

/**
 * Get the articles list
 * @param setArticles useState - setArticles list with the fulfilled request response
 */
export async function getArticles(setLoading: React.Dispatch<React.SetStateAction<boolean>>, setArticles: React.Dispatch<React.SetStateAction<Article[]>>) {
  await axios
    .get('http://localhost:8000/articles')
    .then(res => setArticles(res.data))
    .catch(error => {
      console.error("Error fetching data:", error);
    })
    .finally(() => setLoading(false));
}

export function createArticle(title: string, content: string) {
  axios
    .post(
      'http://localhost:8000/articles/create/',
      { title, content },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    )
    .then(res => res.data)
    .catch(error => {
      error.response?.data?.message || 'Erreur lors de la création.';
    });
}
 