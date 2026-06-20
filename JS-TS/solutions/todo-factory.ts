import { Todo, NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
  return {
    id: nextId++,
    ...input,
    status: TodoStatus.PENDING,
    createdAt: new Date()
  }
}
