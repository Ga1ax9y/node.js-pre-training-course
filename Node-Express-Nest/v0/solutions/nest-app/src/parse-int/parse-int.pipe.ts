import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LoggerService } from '../../logger/logger/logger.service';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  constructor(private readonly logger: LoggerService) { }

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log(`[PIPE] ParseIntPipe: transformation "${value}"`, 'ParseIntPipe');

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      this.logger.warn(`[PIPE] Error: "${value}" is not a valid integer`, 'ParseIntPipe');
      throw new BadRequestException(`"${value}" is not a valid integer`);
    }

    return num;
  }
}
