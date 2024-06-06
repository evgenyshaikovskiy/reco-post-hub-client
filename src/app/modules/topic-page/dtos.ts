export interface ICreateCommentDto {
  topicId: string;
  textContent: string;
  htmlContent: string;
}

export interface ICreateAnswerDto {
  topicId: string;
  textContent: string;
  htmlContent: string;
  parentCommentId: string;
}

export interface ICreateScoreDto {
  score: number;
  topicId: string;
}

export interface IUpdateScoreDto {
  score: number;
  id: string;
}

export interface IUpdateTopicDto {
  published: boolean;
}
