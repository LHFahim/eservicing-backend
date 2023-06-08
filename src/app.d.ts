import { Types } from 'mongoose';

declare global {
    interface String {
        toObjectID(): Types.ObjectId;
        toDate(): Date;
    }
}
