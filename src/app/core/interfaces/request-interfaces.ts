import { IUser } from './user.interface';

export interface IPublicUser {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  userPictureId: string;
}

export interface ITopic {
  topicId: string;
  author: IUser;
  url: string;
  title: string;
  textContent: string;
  htmlContent: string;
  hashtags: IHashtag[];
  scores: IScore[];
  summarization: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScore {
  id: string;
  actor: IUser;
  score: number;
  topic: ITopic;
}

export interface IHashtag {
  id: string;
  name: string;
}

export interface IComment {
  id: string;

  authorId: string;

  topicId: string;

  textContent: string;

  htmlContent: string;

  mentionedProfileIds: number[];

  createdAt: Date;

  updatedAt: Date;
}
