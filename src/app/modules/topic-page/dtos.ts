export interface ICreateCommentDto {
  authorId: string;
  topicId: string;
  textContent: string;
  htmlContent: string;
  mentionedProfileIds: number[];
}

export interface ICreateScoreDto {
  score: number;
  topicId: string;
}

export interface IUpdateScoreDto {
  score: number;
  id: string;
}
