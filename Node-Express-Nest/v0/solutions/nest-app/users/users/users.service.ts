import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from '../../logger/logger/logger.service';

export interface User {
    id: number;
    name: string;
    email: string;
}

@Injectable()
export class UsersService {
    private users: User[] = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
    ];

    constructor(private readonly logger: LoggerService) { }

    findById(id: number): User {
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            this.logger.warn(`User ${id} not found`, 'UserService');
            throw new NotFoundException(`User ${id} not found`);
        }
        this.logger.log(`Found user: ${user.name}`, 'UserService');
        return user;
    }

}
