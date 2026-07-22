import { Exclude, Expose, Transform } from 'class-transformer';
import { TodoStatus } from './todo.entity';

@Exclude()
export class TodoResponseDto {
  @Expose()
  id!: number;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  status!: TodoStatus;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt!: string;

}
