import { prisma } from "../lib/prisma";

async function main() {
    console.log('Starting seed...');

    const alice = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@example.com',
        },
    });

    const bob = await prisma.user.create({
        data: {
            name: 'Bob',
            email: 'bob@example.com',
        },
    });

    console.log(`Created users: ${alice.name}, ${bob.name}`);

    await prisma.todo.createMany({
        data: [
            {
                title: 'Buy groceries',
                description: 'Milk, bread, eggs',
                status: 'active',
                userId: alice.id,
            },
            {
                title: 'Call mom',
                description: 'Discuss weekend plans',
                status: 'active',
                userId: alice.id,
            },
            {
                title: 'Read a book',
                description: 'Finish "Clean Code"',
                status: 'completed',
                userId: alice.id,
            },
        ],
    });

    await prisma.todo.createMany({
        data: [
            {
                title: 'Go to the gym',
                description: 'Leg day',
                status: 'active',
                userId: bob.id,
            },
            {
                title: 'Prepare presentation',
                description: 'For Monday meeting',
                status: 'active',
                userId: bob.id,
            },
            {
                title: 'Pay bills',
                status: 'completed',
                userId: bob.id,
            },
        ],
    });

    console.log('Created 3 todos for Alice and 3 todos for Bob');
    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
