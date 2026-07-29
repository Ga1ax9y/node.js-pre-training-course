import { prisma } from './lib/prisma';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const CACHE_TTL = 300;

async function getUserTodos(userId: number) {
    const cacheKey = `todos:user:${userId}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        console.log(`CACHE HIT: Data for user ${userId} retrieved from Redis`);
        return JSON.parse(cachedData);
    }

    console.log(`CACHE MISS: Reading data for user ${userId} from PostgreSQL`);
    const todos = await prisma.todo.findMany({
        where: { userId },
        include: { user: { select: { name: true } } },
    });

    await redis.set(cacheKey, JSON.stringify(todos), 'EX', CACHE_TTL);
    console.log(`Data saved to Redis with TTL ${CACHE_TTL} seconds`);

    return todos;
}

async function invalidateUserTodosCache(userId: number) {
    const cacheKey = `todos:user:${userId}`;
    await redis.del(cacheKey);
    console.log(`Cache for user ${userId} invalidated`);
}

async function main() {
    console.log('Redis Cache Demonstration\n');

    const user = await prisma.user.findFirst();
    if (!user) {
        throw new Error('User not found! Run seed.ts first');
    }

    console.log(`Testing for user: ${user.name} (ID: ${user.id})\n`);

    console.log('=== Scenario 1: First request (cache miss) ===');
    await redis.flushall();
    const todos1 = await getUserTodos(user.id);
    console.log(`Todos retrieved: ${todos1.length}\n`);

    console.log('=== Scenario 2: Second request (cache hit) ===');
    const todos2 = await getUserTodos(user.id);
    console.log(`Todos retrieved: ${todos2.length}\n`);

    console.log('=== Scenario 3: Create todo and invalidate cache ===');

    const newTodo = await prisma.todo.create({
        data: {
            title: 'New todo from Redis demo',
            status: 'active',
            userId: user.id,
        },
    });
    console.log(`Created todo: ${newTodo.title}`);

    await invalidateUserTodosCache(user.id);

    console.log('\nRequest after invalidation:');
    const todos3 = await getUserTodos(user.id);
    console.log(`Todos retrieved: ${todos3.length} (now 1 more)\n`);

    console.log('=== Scenario 4: TTL demonstration (accelerated) ===');

    const shortTTL = 5;
    const cacheKey = `todos:user:${user.id}`;
    await redis.set(cacheKey, JSON.stringify(todos3), 'EX', shortTTL);
    console.log(`Data saved with short TTL: ${shortTTL} seconds`);

    console.log('\nImmediately after saving:');
    await getUserTodos(user.id);

    console.log(`\nWaiting ${shortTTL} seconds for TTL to expire...`);
    await new Promise(resolve => setTimeout(resolve, (shortTTL + 1) * 1000));

    console.log('\nAfter TTL expiration:');
    await getUserTodos(user.id);

    console.log('\n=== Bonus: Check key TTL ===');
    await redis.set('test:key', 'data', 'EX', 60);
    const ttl = await redis.ttl('test:key');
    console.log(`Remaining lifetime of key 'test:key': ${ttl} seconds`);

    console.log('\nDemonstration completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await redis.quit();
        console.log('\nConnections closed.');
    });
