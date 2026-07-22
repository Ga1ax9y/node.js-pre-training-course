import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
    log(message: string, context = ''): void {
        const ctx = context ? `[${context}]` : '';
        console.log(`[LOG] ${ctx} ${new Date().toISOString()} - ${message}`);
    }

    warn(message: string, context = ''): void {
        console.warn(`[WARN] ${context ? `[${context}]` : ''} ${new Date().toISOString()} - ${message}`);
    }
}
