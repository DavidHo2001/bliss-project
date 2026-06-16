import { UserResponseDto } from './user-response.dto';

export class PaginatedUsersResponseDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: UserResponseDto[];
}
