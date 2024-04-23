
export interface IPublicUser {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPublicTopic {
  topicId: string;
  authorId: number;
  url: string;
  title: string;
  textContent: string;
  htmlContent: string;
  hashtags: string[];
  summarization: string;
  createdAt: Date;
  updatedAt: Date;
  user: IPublicUser;
}
