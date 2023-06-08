import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseRequiredString implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!value?.trim()) {
            throw new BadRequestException(`${metadata.type} ${metadata.data || 'index'} must be a string`);
        }
        return value;
    }
}
