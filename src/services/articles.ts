import axiosInstance from "../api/axiosInstance";
import { Article, NewComment, PaginatedArticles, Tag } from "../types/api";

export const getArticles = async (
  page: number = 1,
  searchQuery: string = "",
  tags: string[] = []
): Promise<PaginatedArticles> => {
  try {
    let url = `/articles/?page=${page}`;

    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    if (tags.length > 0) {
      const formattedTags = `{${tags.map(tag => tag.trim()).join(',')}}`;
      url += `&tags=${encodeURIComponent(formattedTags)}`;
    }

    const response = await axiosInstance.get<PaginatedArticles>(url);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des articles : ", error);
    throw error; // Relaunch the error so that the calling component can handle it
  }
};

export const getArticleById = async (id: string, commentPage: number = 1): Promise<Article> => {
  try {
    const response = await axiosInstance.get<Article>(`/articles/${id}/?page=${commentPage}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `Erreur lors de la récupération de l'article ${id} : `,
      error
    );
    throw error;
  }
};

export const createArticle = async (
  title: string,
  content: string,
  author: number,
): Promise<Article> => {
  try {
    const response = await axiosInstance.post<Article>("/articles/create/", {
      title,
      content,
      author,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création de l'article : ", error);
    throw error;
  }
};

export const updateArticle = async (
  id: number,
  title: string,
  content: string,
  userId: number | undefined,
  authorName: string | undefined,
  authorBio: string | null | undefined,
  authorProfilePictureUrl: string | null | undefined,
  authorJoinDate: string | undefined,
  tags: number[],
): Promise<Article> => {
  try {
    const response = await axiosInstance.put<Article>(`/articles/update/${id}/`, { 
      title, 
      content, 
      author: { 
        user: userId,
        name: authorName,
        bio: authorBio,
        profile_picture_url: authorProfilePictureUrl,
        join_date: authorJoinDate,
     },
     tags: tags,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour de l'article ${id} : `, error);
    throw error;
  }
};

export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const response = await axiosInstance.get<Tag[]>("/tags/");
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération de tous les tags : ", error);
    throw error;
  }
};

export const createComment = async (comment: NewComment) : Promise<NewComment> => {
  try {
    const response = await axiosInstance.post<NewComment>('/comments/create/', comment);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du commentaire : ", error);
    throw error;
  }
}