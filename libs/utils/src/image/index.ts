import sharpFactory, { Sharp } from 'sharp';
export type OptimiationConfig = {
    format?: 'webp' | 'png' | 'jpeg';
    height?: number;
    width?: number;
};

/**
 *
 * @param file Buffer
 * @param config - optional
 * @returns buffer of optimized image @default webp
 */
export const optimizeImage = async (file: Buffer, config: OptimiationConfig = {}): Promise<Buffer> => {
    const { format = 'webp', height, width } = config;

    const sharp = sharpFactory(file)[format]() as Sharp;

    if (height && width) {
        sharp.resize(width, height, { fit: 'inside' });
    }

    return await sharp.toBuffer();
};
