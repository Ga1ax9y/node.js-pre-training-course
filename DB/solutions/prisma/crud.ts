import { prisma } from "../lib/prisma";

async function main() {
  console.log('CREATE');

  const firstUser = await prisma.user.findFirst();

  if (!firstUser) {
    throw new Error('Error');
  }

  const newTodo = await prisma.todo.create({
    data: {
      title: 'learn Prisma CRUD',
      description: 'create',
      status: 'active',
      userId: firstUser.id,
    },
  });
  console.log('Todo created:', newTodo);
  console.log('');

  console.log('READ');

  const allTodos = await prisma.todo.findMany();
  console.log(`📌 All todos: ${allTodos.length}`);

  const activeTodos = await prisma.todo.findMany({
    where: {
      status: 'active',
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
  console.log('Active todos:', activeTodos);
  console.log('');

  console.log('UPDATE');

  const updatedTodo = await prisma.todo.update({
    where: {
      id: newTodo.id,
    },
    data: {
      status: 'completed',
      title: 'Learn Prisma CRUD (Completed!)',
    },
  });
  console.log('Updated todo:', updatedTodo);
  console.log('');

  console.log('DELETE');

  const deletedTodo = await prisma.todo.delete({
    where: {
      id: newTodo.id,
    },
  });
  console.log('deleted todo:', deletedTodo);
  console.log('');

  const checkDeleted = await prisma.todo.findUnique({
    where: { id: newTodo.id },
  });
  console.log('delete check:', checkDeleted);
}

main()
  .catch((e) => {
    console.error('❌ Error processing CRUD:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\nConnection closed.');
  });
