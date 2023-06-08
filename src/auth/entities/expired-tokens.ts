import { DocumentCTWithTimeStamps, Model } from '@app/utils';
import { Prop } from '@typegoose/typegoose';

export enum ExpiredTokenTypeEnum {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
}

@Model('otps', true)
export class ExpiredTokensEntity extends DocumentCTWithTimeStamps {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    token: string;

    @Prop({ required: true, enum: ExpiredTokenTypeEnum })
    type: ExpiredTokenTypeEnum;
}
