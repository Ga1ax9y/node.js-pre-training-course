import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users/users.service';
import { LoggerService } from '../../logger/logger/logger.service';

export interface AuditEntry {
    id: number;
    action: string;
    userId: number;
    userName: string;
    timestamp: string;
}

@Injectable()
export class AuditService {
    private history: AuditEntry[] = [];
    private nextId = 1;

    constructor(
        private readonly userService: UsersService,
        private readonly logger: LoggerService,
    ) { }

    logAction(action: string, userId: number): AuditEntry {
        const user = this.userService.findById(userId);

        const entry: AuditEntry = {
            id: this.nextId++,
            action,
            userId: user.id,
            userName: user.name,
            timestamp: new Date().toISOString(),
        };

        this.history.push(entry);
        this.logger.log(`Action "${action}" logged for ${user.name}`, 'AuditService');
        return entry;
    }

    getHistory(): AuditEntry[] {
        return this.history;
    }
}
