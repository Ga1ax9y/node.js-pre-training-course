import { Todo, TodoStatus } from './types';

export function toggleAll(state: Todo[], completed: boolean): Todo[] {
  return state.map((todo)=> ({
    ...todo,
    status: completed ? TodoStatus.COMPLETED : TodoStatus.PENDING
  }))
}

export function clearCompleted(state: Todo[]): Todo[] {
  return state.filter((todo)=>{
    todo.status !== TodoStatus.COMPLETED
  })
}

export function countByStatus(state: Todo[], status: TodoStatus): number {
  return state.reduce((acc, curr)=> {
    return curr.status === status ? acc + 1 : acc
  }, 0)
}
