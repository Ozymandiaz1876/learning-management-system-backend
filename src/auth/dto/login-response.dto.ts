import { User } from '../../users/users.model';

export class LoginResponseDto {
  token: string;

  tokenExpires: number;

  user: User;
}
