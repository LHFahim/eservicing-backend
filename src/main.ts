import { GlobalExceptionFilter, GlobalResponseTransformer } from '@app/utils';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'source-map-support/register';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { setupSwagger } from './setupSwagger';
import { I18nService } from 'nestjs-i18n';

const bootstrap = async () => {
    const logger = new Logger('Server Startup');

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.disable('x-powered-by');

    const validationPipe = new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
        transform: true,
        transformOptions: {
            enableCircularCheck: true,
            exposeDefaultValues: true,
        },
    });

    const appConfig = app.get(ConfigService);
    const i18Service = app.get(I18nService);

    app.useGlobalPipes(validationPipe);
    app.useGlobalFilters(new GlobalExceptionFilter(i18Service));
    app.useGlobalInterceptors(new GlobalResponseTransformer());

    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    app.enableCors();

    setupSwagger(app);

    await app.listen(appConfig.port);
    logger.log(`App Started on http://localhost:${appConfig.port}/api`);
};

bootstrap().then();
