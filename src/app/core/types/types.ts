import { IUser } from "../interfaces/user.interface";

export type ToastNotificationType = 'success' | 'info' | 'warning' | 'error';

export enum NotificationType {
  // when other user commented under other user topic
  COMMENT = 'comment',
  // when user resetted own's password
  PASSWORD_RESET = 'password_reset',
  // when other user subscribed to user topics
  SUBSCRIBED = 'subscribed',
  // when user created account
  CREATED = 'created',
  // when user topic was published
  PUBLISHED = 'published_topic',
  // when user data was updated
  DATA_UPDATED = 'data_updated',
  // when other user answers user comment
  COMMENT_ANSWERED = 'comment_answered',
}

export interface INotification {
  id: string;
  type: NotificationType;
  text: string;
  receiver: IUser;
  url?: string;
  viewed: boolean;
  createdAt: Date;
}
