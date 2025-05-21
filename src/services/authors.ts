import axiosInstance from '../api/axiosInstance';
import { AuthorDetails } from '../types/api';

export const getAuthorDetails = async (id: string): Promise<AuthorDetails> => {
  try {
    const response = await axiosInstance.get<AuthorDetails>(`/authors/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des détails de l'auteur ${id} : `, error);
    throw error;
  }
};

// Other fonctions for the articles here (list, update, deletion...)