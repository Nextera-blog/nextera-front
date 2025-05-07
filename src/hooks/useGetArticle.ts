import { useState, useEffect } from 'react';
import axios from 'axios';
import { Article } from '../types/api';

interface UseGetArticleResult {
  article: Article | null;
  loading: boolean;
  error: string | null;
}

export const useGetArticle = (articleId: string | undefined): UseGetArticleResult => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        try {
          const response = await axios.get(`http://localhost:8000/posts/${articleId}`);
          setArticle(response.data);
          setLoading(false);
          setError(null);
        } catch (error: any) {
          console.error("Error fetching article:", error);
          setError("Erreur lors de la récupération de l'article.");
          setLoading(false);
          setArticle(null);
        }
      } else {
        setLoading(false);
        setArticle(null);
      }
    };

    fetchArticle();
  }, [articleId]);

  return { article, loading, error };
};