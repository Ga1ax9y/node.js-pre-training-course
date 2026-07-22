import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title cannot be empty' })
  @MinLength(2, { message: 'title min size is 2 symbols' })
  @MaxLength(100, { message: 'title max size is 100 symbols' })
  declare title: string;

  @IsString({ message: 'description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'description max size is 500 symbols' })
  description?: string;
}
