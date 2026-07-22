import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { AuditModule } from './src/audit/audit.module';
import { LoggerModule } from './logger/logger/logger.module';
import { MathModule } from './math/math/math.module';
import { UsersModule } from './users/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo/todo.entity';

@Module({
  imports: [    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'todos.db',
      entities: [TodoEntity],
      synchronize: true,
    }),
    TodoModule,LoggerModule, MathModule, UsersModule, AuditModule],
})
export class AppModule {}
