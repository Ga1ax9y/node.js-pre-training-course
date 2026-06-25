import { InMemoryRepository } from './repository';
import { addTodo, getTodo, removeTodo, updateTodo } from './todo-crud';
import { createTodo } from './todo-factory';
import { Todo, NewTodo } from './types';

export class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
    this.name = 'TodoNotFoundError';
  }
}

export class TodoApi {
  private repo = new InMemoryRepository<Todo>();

  private delay(): Promise<void> {
    const ms = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async getAll(): Promise<Todo[]> {
    await this.delay()
    return this.repo.findAll();
  }
  async getById(id: number): Promise<Todo> {
    await this.delay()

    const todo = this.repo.findById(id)

    if (!todo)
      throw new TodoNotFoundError(id)

    return todo
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    const todo = createTodo(newTodo)
    this.repo.add(todo)

    return { ...todo }
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    await this.delay()

    const existingTodo = this.repo.findById(id)

    if (!existingTodo)
      throw new TodoNotFoundError(id)

    const updatedTodo = this.repo.update(id, update)

    return { ...updatedTodo };
  }

  async remove(id: number): Promise<void> {
    await this.delay()

    const existingTodo = this.repo.findById(id)

    if (!existingTodo)
      throw new TodoNotFoundError(id)

    this.repo.remove(id)
  }
}
