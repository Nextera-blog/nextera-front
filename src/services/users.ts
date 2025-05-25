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
