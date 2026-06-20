interface Todo {
    id: number,
    title: string,
    description?: string,
    status?: TodoStatus,
    createdAt: Date
}

enum TodoStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED
}

type NewTodo = Omit<Todo, 'id' | 'createdAt'>

export { Todo, TodoStatus, NewTodo };
