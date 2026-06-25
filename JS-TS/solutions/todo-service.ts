import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) { }

  async create(title: string, description = ''): Promise<Todo> {
    if (title.trim() === '') throw new Error('title is required');
    return this.api.add({ title, description });
  }

  async toggleStatus(id: number): Promise<Todo> {
    const todo = await this.api.getById(id);

    return this.api.update(id, { status: todo.status === TodoStatus.PENDING ? TodoStatus.COMPLETED : TodoStatus.PENDING });
  }

  async search(keyword: string): Promise<Todo[]> {
    if (keyword.trim() === '') throw new Error('keyword is required');

    const todos = await this.api.getAll();
    const lowerKeyword = keyword.toLowerCase();

    return todos.filter((todo) => {
      const matchTitle = todo.title.toLowerCase().includes(lowerKeyword);
      const matchDescription = todo.description?.toLowerCase().includes(lowerKeyword);
      return matchTitle || matchDescription;
    })

  }
}
