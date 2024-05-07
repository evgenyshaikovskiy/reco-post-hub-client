export interface IPublicUser {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  userPictureId: string;
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

export interface IComment {
  id: string;

  authorId: number;

  topicId: string;

  textContent: string;

  htmlContent: string;

  mentionedProfileIds: number[];

  createdAt: Date;

  updatedAt: Date;
}
