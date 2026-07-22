import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger/logger.service';

@Injectable()
export class MathService {
    constructor(private readonly logger: LoggerService) { }
    
    add(a: number, b: number): number {
        const result = a + b;
        this.logger.log(`add(${a}, ${b}) = ${result}`, 'MathService');
        return result;
    }

    divide(a: number, b: number): number {
        if (b === 0) throw new Error('Division by zero');
        const result = a / b;
        this.logger.log(`divide(${a}, ${b}) = ${result}`, 'MathService');
        return result;
    }
}
