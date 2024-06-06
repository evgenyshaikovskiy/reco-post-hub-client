/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICredentials } from './credentials.interface';
import { IComment, IScore, ITopic } from './request-interfaces';

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  confirmed: boolean;
  bio: string;
  karma: number;
  rating: number;
  credentials: ICredentials;
  settings: ISettings;
  userPictureId: string;
  subscriptions: ISubscription[];
  topics: ITopic[];
  scores: IScore[];
  role: UserRole;

  createdAt: Date;
  updatedAt: Date;
}

export interface ISettings {
  showBio: boolean;
  showEmail: boolean;
  showUserSubscriptions: boolean;
  showHashtagSubscriptions: boolean;
  showComments: boolean;
  showKarma: boolean;  
  showRating: boolean;
  showScores: boolean;
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
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  userPictureId: string;
  
  bio?: string;
  email?: string;
  subscriptions?: ISubscription[];
  hashtagSubscriptions?: ISubscription[];
  comments?: IComment[];
  

  karma?: number;
  rating?: number;
}
