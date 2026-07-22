import { Controller, Get, Query } from '@nestjs/common';
import { MathService } from './math.service';
import { LoggerService } from '../../logger/logger/logger.service';

@Controller('math')
export class MathController {
    constructor(private readonly mathService: MathService,
                    private readonly logger: LoggerService) { }

    @Get('add')
    add(@Query('a') a: string, @Query('b') b: string){
        this.logger.log(`GET /math/add?a=${a}&b=${b}`, 'MathController');
        return { result: this.mathService.add(+a, +b) };
    }
}
