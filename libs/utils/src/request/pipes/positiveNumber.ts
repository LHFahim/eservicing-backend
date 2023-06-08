import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class ParsePositiveNumber implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): number {
        const num = parseInt(value, 10);
        if (isNaN(num))
            throw new BadRequestException(`${metadata.type} ${metadata.data || 'index'} must be a valid number`);
        if (num < 0)
            throw new BadRequestException(`${metadata.type} ${metadata.data || 'index'} must be a positive number`);
        return num;
    }
}
