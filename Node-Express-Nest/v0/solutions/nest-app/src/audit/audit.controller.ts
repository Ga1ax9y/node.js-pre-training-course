import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuditService } from './audit.service';
import { LoggingInterceptor } from '../logging/logging.interceptor';
import { AdminGuard } from '../guards/admin/admin.guard';
import { ParseIntPipe } from '../parse-int/parse-int.pipe';

@Controller('audit')
@UseInterceptors(LoggingInterceptor)
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Post()
    @UseGuards(AdminGuard)
    @UsePipes(ParseIntPipe)
    logAction(@Body() body: { action: string; userId: number }) {
        console.log('[HANDLER] logAction in process');
        return this.auditService.logAction(body.action, body.userId);
    }

    @Get()
    getHistory() {
        console.log('[HANDLER] getHistory active');
        return this.auditService.getHistory();
    }
}
