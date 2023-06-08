import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserActivationQuery {
    @Expose()
    @IsNotEmpty()
    @ApiProperty({ default: true, type: Boolean })
    isActive: boolean;
}
