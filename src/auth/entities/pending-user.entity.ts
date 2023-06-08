import { DocumentCTWithTimeStamps, Model } from '@app/utils';
import { Prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Model('pending_users', true)
export class PendingUserEntity extends DocumentCTWithTimeStamps {
    @ApiProperty({ required: true })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    @Prop({ required: true, trim: true })
    email: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    @Prop({ required: true })
    code: string;
}
