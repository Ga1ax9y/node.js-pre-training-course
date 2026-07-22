import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { UsersModule } from '../../users/users/users.module';
import { ParseIntPipe } from '../parse-int/parse-int.pipe';

@Module({
    imports: [UsersModule],
    providers: [AuditService, ParseIntPipe],
    controllers: [AuditController]
})
export class AuditModule { }
