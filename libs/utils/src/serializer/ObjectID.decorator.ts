import { Transform } from 'class-transformer';

export const ObjectID = () => (target: any, propertyKey: string) => {
    Transform((value) => {
        return value.obj[value.key]?.toString() || '';
    })(target, propertyKey);
};
