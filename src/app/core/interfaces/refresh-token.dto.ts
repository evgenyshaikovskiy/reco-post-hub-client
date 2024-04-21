export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LogOutDto extends RefreshTokenDto {}
