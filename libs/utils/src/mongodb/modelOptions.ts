import { modelOptions } from '@typegoose/typegoose';

export const Model = (collection: string, timestamps: boolean) => {
    return modelOptions({
        schemaOptions: {
            collection,
            timestamps,
            toJSON: {
                virtuals: true,
                getters: true,
                transform: (_, ret) => {
                    ret.id = ret._id.valueOf();
                    delete ret._id;
                    delete ret.__v;
                    return ret;
                },
            },
            toObject: {
                virtuals: true,
                getters: true,
                transform: (_, ret) => {
                    ret.id = ret._id.valueOf();
                    delete ret._id;
                    delete ret.__v;
                    return ret;
                },
            },
        },
    });
};
