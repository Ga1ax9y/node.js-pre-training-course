#!/usr/bin/env ts-node
// CLI entry for Task 10
import { ToDoManager } from "./todo-manager";

async function main() {
    const manager = new ToDoManager()
    await manager.init()

    const command = process.argv[2]
    const arg1 = process.argv[3]
    const arg2 = process.argv[4]

    switch (command) {
        case 'list':
            const todos = await manager.list();
            console.table(todos);
            break;
        case 'add':
            await manager.add(arg1, arg2);
            console.table(await manager.list());

            break;
        case 'complete':
            await manager.complete(Number(arg1))
            console.table(await manager.list());
            break;
        default:
            console.log('Доступные команды: list, add <title> <desc>, complete <id>');
    }
}


main()
