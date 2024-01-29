/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICredentials } from "./credentials.interface";

export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  confirmed: boolean;
  credentials: ICredentials;
  // TODO fix created at type
  createdAt: any;
  updatedAt: any;
}