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
  private state: Todo[] = []

  private delay(): Promise<void> {
    const ms = Math.floor(Math.random()*(600-300+1))+300;
    return new Promise((resolve)=>setTimeout(resolve, ms));
  }
  async getAll(): Promise<Todo[]> {
    await this.delay()
    return [...this.state]
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    const todo = createTodo(newTodo)
    this.state = addTodo(this.state, todo)

    return {...todo}
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    await this.delay()

    const existingTodo = getTodo(this.state, id)

    if (!existingTodo)
      throw new TodoNotFoundError(id)

    this.state = updateTodo(this.state, id, update)

    const updatedTodo = getTodo(this.state, id)

    if (!updatedTodo)
      throw new TodoNotFoundError(id)

    return {...updatedTodo};
  }

  async remove(id: number): Promise<void> {
    this.delay()

    const existingTodo = getTodo(this.state, id)

    if (!existingTodo)
      throw new TodoNotFoundError(id)

    this.state = removeTodo(this.state, id)
  }
}
