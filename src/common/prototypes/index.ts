import { Types } from 'mongoose';

String.prototype.toObjectID = function () {
    return new Types.ObjectId(this);
};

String.prototype.toDate = function () {
    return new Date(this);
};
