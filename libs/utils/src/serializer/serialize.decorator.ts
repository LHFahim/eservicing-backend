import { applyDecorators, ClassSerializerInterceptor, SerializeOptions, UseInterceptors } from '@nestjs/common';

export const Serialize = () =>
    applyDecorators(
        UseInterceptors(ClassSerializerInterceptor),
        SerializeOptions({
            strategy: 'exposeAll',
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
            exposeDefaultValues: true,
        }),
    );
