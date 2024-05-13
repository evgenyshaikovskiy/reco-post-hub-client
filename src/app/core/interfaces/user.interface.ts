/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICredentials } from './credentials.interface';
import { ITopic } from './request-interfaces';

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  confirmed: boolean;
  credentials: ICredentials;
  userPictureId: string;
  subscriptions: ISubscription[];
  topics: ITopic[];
  role: UserRole;

  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription {
  id: string;
  actor: IUser;
  type: SubscriptionType;
  // either user id or hashtag id
  targetId: string;
}

export enum SubscriptionType {
  TO_USER = 'to-user',
  TO_HASHTAG = 'to-hashtag',
}

export enum UserRole {
  ADMIN = 'admin',
  MOD = 'mod',
  USER = 'user',
}

export interface IUserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  confirmed: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  userPictureId: string;

  // relationships
  subscriptions: ISubscription[];
  topics: ITopic[];
}