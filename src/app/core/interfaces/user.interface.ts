/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICredentials } from "./credentials.interface";

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  confirmed: boolean;
  credentials: ICredentials;
  userPictureId: string;
  // TODO fix created at type
  createdAt: any;
  updatedAt: any;
}