import axios from "axios";
import { Article } from "../types/api";

/**
 * Get the articles list
 * @param setArticles useState - setArticles list with the fulfilled request response
 */
export async function getArticles(setLoading: React.Dispatch<React.SetStateAction<boolean>>, setArticles: React.Dispatch<React.SetStateAction<Article[]>>) {
  await axios
    .get('http://localhost:8000/list')
    .then(res => setArticles(res.data))
    .catch(error => {
      console.error("Error fetching data:", error);
    })
    .finally(() => setLoading(false));
}
