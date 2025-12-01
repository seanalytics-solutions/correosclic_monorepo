import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { envConfig } from '../config/env.config';
import * as path from 'path';
import * as mime from 'mime-types';

@Injectable()
export class CloudflareService {
  private readonly s3: S3Client;
  private readonly bucketName = envConfig.cloudflare_bucket_name;

  constructor() {
    this.s3 = new S3Client({
      endpoint: envConfig.cloudflare_r2_endpoint,
      credentials: {
        accessKeyId: envConfig.cloudflare_r2_access_key,
        secretAccessKey: envConfig.cloudflare_r2_secret_key,
      },
      region: 'auto',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_');
    const fileName = `${Date.now()}-${sanitizedOriginalName}`;
    const filePath = path.join('uploads', fileName);
    const contentType =
      mime.contentType(sanitizedOriginalName) || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: contentType,
    });

    await this.s3.send(command);
    return filePath;
  }
  async getSignedUrl(filePath: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return url;
  }
  async deleteFile(filePath: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    await this.s3.send(command);
  }
}
