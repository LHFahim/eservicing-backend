import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseImageFilePipe implements PipeTransform {
    transform(
        files: Express.Multer.File | Express.Multer.File[],
        metadata: ArgumentMetadata,
    ): Express.Multer.File | Express.Multer.File[] {
        if (!files) {
            throw new BadRequestException('Validation failed (file expected)');
        }

        if (Array.isArray(files) && files.length === 0) {
            throw new BadRequestException('Validation failed (files expected)');
        }

        if (Array.isArray(files)) {
            if (!this.verifyImageExtension(files.map((item) => item.mimetype))) {
                throw new BadRequestException('Only image files are allowed');
            }
            return files;
        }

        if (!this.verifyImageExtension([files.mimetype])) {
            throw new BadRequestException('Only image files are allowed');
        }

        return files;
    }

    verifyImageExtension(mimes: string[]) {
        return mimes.every((item) => item.includes('image'));
    }
}
