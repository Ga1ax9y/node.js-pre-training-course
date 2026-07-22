// todo/todo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TodoStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity('todos')
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 500, nullable: true })
  description!: string;

  @Column({
    type: 'varchar',
    default: TodoStatus.PENDING,
  })
  status!: TodoStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
