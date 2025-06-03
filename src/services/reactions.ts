import axiosInstance from "../api/axiosInstance";

interface ArticleReactionResponse {
  reaction_type: number;
  user: number;
  article: number;
}

interface ReactionDeletedResponse {
  message: string;
}

export type ArticleReactionResult = ArticleReactionResponse | ReactionDeletedResponse;

export const toggleArticleReaction = async (reactionTypeId: number, userId: number, articleId: number, ): Promise<ArticleReactionResult> => {
  try {
    const response = await axiosInstance.put<ArticleReactionResult>(`/articles/reactions/${articleId}/`, {
      reaction_type: reactionTypeId,
      user: userId,
      article: articleId,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la gestion de la réaction : ", error);
    throw error;
  }
};