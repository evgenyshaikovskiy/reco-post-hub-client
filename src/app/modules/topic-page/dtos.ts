export interface ICreateCommentDto {
  authorId: string;
  topicId: string;
  textContent: string;
  htmlContent: string;
  mentionedProfileIds: number[];
}