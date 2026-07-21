export const TodoStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
};

let todos = [
  { id: 1, title: 'Learn Express', description: 'Study middleware', status: TodoStatus.PENDING },
  { id: 2, title: 'Build REST API', description: 'With validation', status: TodoStatus.PENDING },
];
let nextId = 3;

export const getAll = () => todos;

export const getById = (id) => todos.find(t => t.id === id) || null;

export const add = ({ title, description = '' }) => {
  const newTodo = {
    id: nextId++,
    title,
    description,
    status: TodoStatus.PENDING,
  };
  todos.push(newTodo);
  return newTodo;
};

export const update = (id, updates) => {
  const todo = todos.find(t => t.id === id);
  if (!todo) return null;

  if (updates.title !== undefined) todo.title = updates.title;
  if (updates.description !== undefined) todo.description = updates.description;
  if (updates.status !== undefined) todo.status = updates.status;

  return todo;
};

export const remove = (id) => {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
};

export const toggleStatus = (id) => {
  const todo = todos.find(t => t.id === id);
  if (!todo) return null;
  todo.status = todo.status === TodoStatus.PENDING
    ? TodoStatus.COMPLETED
    : TodoStatus.PENDING;
  return todo;
};

export const search = (keyword) => {
  const lower = keyword.toLowerCase();
  return todos.filter(t =>
    t.title.toLowerCase().includes(lower) ||
    (t.description && t.description.toLowerCase().includes(lower))
  );
};
