import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private logger = new Logger('Exception Filter');

    constructor(private i18n: I18nService) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const request = ctx.getRequest<Request>();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const lang = request.headers['accept-language'] || 'en';

        let error = 'Internal Server Error';
        let statusCode = 500;

        if (exception instanceof HttpException) {
            const response = exception.getResponse() as { message?: any };
            const translateOptions = { lang, debug: true };

            error = Array.isArray(response?.message)
                ? response.message.map((msg) => this.i18n.translate(msg, translateOptions)).join(', ')
                : this.i18n.translate(response?.message || response, translateOptions) ||
                  this.i18n.translate(exception.message, translateOptions) ||
                  '';

            statusCode = exception.getStatus();
        }

        this.logger.error(exception.message, exception.stack);

        response.status(statusCode).json({
            success: false,
            data: null,
            message: error,
            error: error,
        });
    }
}
