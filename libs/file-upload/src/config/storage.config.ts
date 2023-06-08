import { diskStorage } from 'multer';
import { extname } from 'path';

export const localFileStorage = (additionalPath = '') => {
    const uploadDir = `./uploads${additionalPath}`;

    return diskStorage({
        destination: uploadDir,
        filename: (req, file, callback) => {
            callback(null, generateFilename(file));
        },
    });
};

function generateFilename(file: Express.Multer.File) {
    return `${Date.now()}${extname(file.originalname)}`;
}
