import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { ObjectID } from './ObjectID.decorator';

export class DocumentCT {
    @ApiProperty({ name: 'id', type: String })
    @ObjectID()
    @Expose({ name: 'id' })
    _id?: Types.ObjectId;
}

export class DocumentCTWithTimeStamps extends DocumentCT {
    @ApiProperty()
    @Expose()
    public createdAt?: Date;

    @ApiProperty()
    @Expose()
    public updatedAt?: Date;
}
