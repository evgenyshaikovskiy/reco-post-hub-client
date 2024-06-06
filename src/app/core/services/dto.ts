import { ISettings } from "../interfaces/user.interface";

export interface IUpdateUserDto {
  username?: string;
  name?: string;
  confirmed?: boolean;
  userPictureId?: string;
  bio?: string;
  settings?: ISettings;
}
