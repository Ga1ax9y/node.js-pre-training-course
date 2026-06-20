import { Todo } from './types';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
  return [...state, todo]
}

export function updateTodo(state: Todo[], id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo[] {

  return state.map((todo)=>{
    if (todo.id === id){
      todo = {
        ...todo,
        ...update
      }
    }
    return todo
  })

}

export function removeTodo(state: Todo[], id: number): Todo[] {
  return state.filter(todo => todo.id !== id)
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
  return state.find((todo)=> todo.id === id)
}
