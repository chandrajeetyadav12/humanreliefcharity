import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./s3";
import crypto from "crypto";

export async function uploadToS3(fileBuffer, folder, mimeType) {
  const fileName =
    `${folder}/` +
    crypto.randomBytes(16).toString("hex");

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  return {
    key: fileName,
    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
  };
}
