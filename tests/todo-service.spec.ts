import { InMemoryRepository } from "../JS-TS/solutions/repository"
import { TodoApi } from "../JS-TS/solutions/todo-api";
import { createTodo } from "../JS-TS/solutions/todo-factory";
import { TodoService } from "../JS-TS/solutions/todo-service";
import { Todo, TodoStatus } from "../JS-TS/solutions/types"

describe('Task 9: Repo tests', () => {
    let repo: InMemoryRepository<Todo>

    beforeEach(() => {
        repo = new InMemoryRepository<Todo>();
    });


    it('adding todo', () => {
        const todo: Todo = { id: 1, title: "first", createdAt: new Date(), status: TodoStatus.PENDING }
        repo.add(todo)
        jest.runAllTimers()
        expect(repo.findById(1)).toEqual(todo)
        expect(repo.findAll()).toEqual([todo])
    });

    it('remove todo', () => {
        const todo: Todo = { id: 1, title: 'To Remove', status: TodoStatus.PENDING, createdAt: new Date() };
        repo.add(todo);
        repo.remove(1);

        expect(repo.findById(1)).toBeUndefined();
    });

    it('updated todo', () => {
        const todo: Todo = { id: 1, title: 'To update', status: TodoStatus.PENDING, createdAt: new Date() };
        repo.add(todo)
        repo.update(1, { title: 'updated', status: TodoStatus.COMPLETED })
        expect(repo.findById(1)?.title).toBe('updated')
        expect(repo.findById(1)?.status).toBe(TodoStatus.COMPLETED)
    });

    it('Todo not found', () => {
        expect(() => repo.remove(666)).toThrow('Entity with id 666 not found')
    })
})

describe('Task 9: TodoService and api tests', () => {
    let api: TodoApi
    let service: TodoService

    beforeEach(() => {
        api = new TodoApi()
        service = new TodoService(api)
        jest.useFakeTimers();
    })

    afterEach(()=> {
        jest.useRealTimers();
    })

    it('create, search and toggle status of a todo', async () => {
        const createdTodo = await service.create('Buy Milk', 'Organic 2%');

        expect(createdTodo).toHaveProperty('id');
        expect(createdTodo.title).toBe('Buy Milk');
        expect(createdTodo.description).toBe('Organic 2%');
        expect(createdTodo.status).toBe(TodoStatus.PENDING);

        const searchResults = await service.search('organic');

        expect(searchResults.length).toBeGreaterThan(0);
        expect(searchResults[0].id).toBe(createdTodo.id);

        const updatedTodo = await service.toggleStatus(createdTodo.id);

        expect(updatedTodo.status).toBe(TodoStatus.COMPLETED);

        const revertedTodo = await service.toggleStatus(createdTodo.id);
        expect(revertedTodo.status).toBe(TodoStatus.PENDING);

    }, 15000);

    it('throw an error when toggling a non-existing todo', async () => {
        await expect(service.toggleStatus(9999)).rejects.toThrow();
    }, 10000);

    it('throw validation error for empty title without hitting API', async () => {
        await expect(service.create('   ')).rejects.toThrow('title is required');

    });
});
