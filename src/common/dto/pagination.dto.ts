import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @Expose()
    @ApiProperty({ type: Number })
    total: number;

    @Expose()
    @ApiProperty({ type: Number })
    current: number;

    @Expose()
    @ApiProperty({ type: Number })
    next: number;

    @Expose()
    @ApiProperty({ type: Number })
    previous: number;
}
