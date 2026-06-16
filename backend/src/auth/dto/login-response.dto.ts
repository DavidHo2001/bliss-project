import { Role } from '@prisma/client';

export class UserInfoDto {
    id: number;
    name: string;
    email: string;
    role: Role;
  }
  
  export class LoginResponseDto {
    access_token: string;
    user: UserInfoDto;
  }
  