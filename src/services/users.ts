import axiosInstance from "../api/axiosInstance";
import { CurrentUser } from "../types/api";

export const getCurrentUser = async (): Promise<CurrentUser> => {
  try {
    const response = await axiosInstance.get<CurrentUser>("/users/current/");
    return response.data;
  } catch (error: any) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur courant : ",
      error
    );
    throw error;
  }
};

export const updateProfile = async (userData: {
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  author?: {
    name?: string;
    bio?: string | null;
  };
}, userId: number): Promise<CurrentUser> => {
  try {
    const response = await axiosInstance.put<CurrentUser>(`/users/update/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    console.error(
      "Erreur lors de la mise à jour du profil de l'utilisateur courant : ",
      error
    );
    throw error;
  }
};
