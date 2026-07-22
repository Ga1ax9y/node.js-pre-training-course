import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoEntity, TodoStatus } from './todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoResponseDto } from './todo-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) { }

  async findAll(): Promise<TodoResponseDto[]> {
    const entities = await this.todoRepository.find({
      order: { createdAt: 'DESC' },
    });
    return this.toResponseArray(entities);
  }

  async findOne(id: number): Promise<TodoResponseDto> {
    const entity = await this.todoRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return this.toResponse(entity);
  }

  async create(dto: CreateTodoDto): Promise<TodoResponseDto> {
    const entity = this.todoRepository.create({
      title: dto.title,
      description: dto.description,
      status: TodoStatus.PENDING,
    });

    const saved = await this.todoRepository.save(entity);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateTodoDto): Promise<TodoResponseDto> {
    const entity = await this.todoRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    if (dto.title !== undefined) entity.title = dto.title;
    if (dto.description !== undefined) entity.description = dto.description;

    const saved = await this.todoRepository.save(entity);
    return this.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }

  async toggleStatus(id: number): Promise<TodoResponseDto> {
    const entity = await this.todoRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    entity.status =
      entity.status === TodoStatus.PENDING
        ? TodoStatus.COMPLETED
        : TodoStatus.PENDING;

    const saved = await this.todoRepository.save(entity);
    return this.toResponse(saved);
  }

  private toResponse(entity: TodoEntity): TodoResponseDto {
    return plainToInstance(TodoResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }

  private toResponseArray(entities: TodoEntity[]): TodoResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }
}
