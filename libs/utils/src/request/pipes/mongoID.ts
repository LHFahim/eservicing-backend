import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

export class ParseMongoID implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!isMongoId(value))
            throw new BadRequestException(`${metadata.type} ${metadata.data || 'id'} must be a valid mongoDB ID`);
        return value.trim();
    }
}

export class ParseOptionalMongoID implements PipeTransform<string, string | null> {
    transform(value: string, metadata: ArgumentMetadata): string | null {
        if (!value || value === 'null') return null;
        if (!isMongoId(value)) {
            throw new BadRequestException(`${metadata.type} ${metadata.data || 'id'} must be a valid mongoDB ID`);
        }
        return value.trim();
    }
}
