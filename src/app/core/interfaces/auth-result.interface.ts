import { IUser } from './user.interface';

export interface IAuthResult {
  user: IUser;
  accessToken: ITokenMetadata;
  refreshToken: ITokenMetadata;
}

export interface ITokenMetadata {
  token: string;
  expiredAt: number;
}
