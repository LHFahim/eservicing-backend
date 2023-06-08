import { DocumentCTWithTimeStamps, Model } from '@app/utils';
import { Prop } from '@typegoose/typegoose';

export enum OTPTypeEnum {
    RESET_PASS = 'RESET_PASS',
    EMAIL_CHANGE = 'EMAIL_CHANGE',
    EMAIL_CHANGE_VERIFY_EMAIL = 'EMAIL_CHANGE_VERIFY_EMAIL',
}

@Model('otps', true)
export class OTPEntity extends DocumentCTWithTimeStamps {
    @Prop({ required: true, trim: true })
    email: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    isVerified: boolean;

    @Prop({ required: true, enum: OTPTypeEnum })
    type: OTPTypeEnum;
}
