import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

/**
 * @param {string} fileContent
 * @returns {Promise<string>}
 */
export async function uploadToS3(fileContent: string): Promise<string> {
  const fileName = `exports/${uuidv4()}.csv`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: 'text/csv',
  });

  await s3Client.send(command);
  
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

/**
 * @param {number} limit
 * @returns {Promise<any[]>}
 */
export async function listExportsFromS3(limit = 100): Promise<any[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: 'exports/',
    MaxKeys: limit,
  });

  const { Contents } = await s3Client.send(command);

  if (!Contents) {
    return [];
  }

  return Contents
    .map(file => ({
      fileName: file.Key,
      sizeKB: file.Size ? Math.round(file.Size / 1024) : 0,
      lastModified: file.LastModified,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
    }))
    .sort((a, b) => new Date(b.lastModified!).getTime() - new Date(a.lastModified!).getTime());
}