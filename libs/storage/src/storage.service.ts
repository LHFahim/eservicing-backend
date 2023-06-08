import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

export type StorageModuleConfig = {
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    domainName: string;
};

@Injectable()
export class StorageService {
    private s3: S3;
    private bucket: string;
    private readonly domain: string;

    constructor(@Inject('STORAGE_CONFIG') config: StorageModuleConfig) {
        this.s3 = new S3({ credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } });
        this.bucket = config.bucket;
        this.domain = config.domainName;
    }

    async delete(folder: string, imageURL: string) {
        return await this.s3
            .deleteObject({
                Bucket: this.bucket,
                Key: imageURL.replace(`${this.domain}/${folder}/`, ''),
            })
            .promise()
            .catch(console.error);
    }

    async upload(folder: string, fileName: string, file: Buffer) {
        const data = await this.s3.upload({ Bucket: this.bucket, Body: file, Key: `${folder}/${fileName}` }).promise();
        return `${this.domain}/${data.Key}`;
    }
}
