export interface ICreateCommentDto {
  authorId: number;
  topicId: string;
  textContent: string;
  htmlContent: string;
  mentionedProfileIds: number[];
}