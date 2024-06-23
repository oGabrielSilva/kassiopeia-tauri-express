import { UserEntity } from '@/modules/user/entities/UserEntity';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class AwsS3Client {
  private static instance: AwsS3Client;
  private static s3Client: S3Client;

  private static urlBase = 'https://s3.sa-east-1.amazonaws.com/[bucketName]/[filePath]';

  private readonly issuer = process.env.JWT_ISSUER ?? 'None';

  private constructor(private readonly bucketName: string) {}

  private normalizeFinalPath(uid: string, path: string) {
    let part = path.startsWith('/') ? path.slice(1) : path;
    part = part.endsWith('/') ? part : part + '/';
    return part.concat(uid.startsWith('/') ? uid.slice(1) : uid);
  }

  private requireS3PrivateURL(finalPath: string) {
    return AwsS3Client.urlBase
      .replace('[bucketName]', this.bucketName)
      .replace('[filePath]', finalPath);
  }

  public get s3() {
    if (!AwsS3Client.s3Client) AwsS3Client.s3Client = new S3Client({});
    return AwsS3Client.s3Client;
  }

  public async uploadBuffer(
    user: UserEntity,
    uid: string,
    path: string,
    file: Express.Multer.File
  ) {
    const key = this.normalizeFinalPath(uid, path);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      Metadata: {
        'Content-Type': file.mimetype,
        origin: `type: ${user.id}`,
        email: user.email,
        issuer: this.issuer,
      },
      ContentType: file.mimetype,
      ContentLength: file.size,
    });

    try {
      const response = await this.s3.send(command);
      return { privateURL: this.requireS3PrivateURL(key), response };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async require(finalPath: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: finalPath,
    });

    try {
      const result = await this.s3.send(command);
      return { object: result.Body, url: this.requireS3PrivateURL(finalPath), result };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static get client() {
    if (!AwsS3Client.instance) {
      const bucketName = process.env.AWS_BUCKET_NAME;
      if (!bucketName) console.error('AWS BUCKET NOT DEFINED');
      AwsS3Client.instance = new AwsS3Client(bucketName ?? '');
    }

    return AwsS3Client.instance;
  }
}
