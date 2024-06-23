import { AwsS3Client } from '@/aws/S3Client';
import { UserEntity } from '@/modules/user/entities/UserEntity';

export class ImageUploadService {
  private static instance: ImageUploadService;

  private s3 = AwsS3Client.client;

  public async require(id: string) {
    return await this.s3.require(id);
  }

  public async uploadBuffer(
    user: UserEntity,
    uid: string,
    path: string,
    file: Express.Multer.File
  ) {
    return await this.s3.uploadBuffer(user, uid, path, file);
  }

  public static get service() {
    if (!ImageUploadService.instance) ImageUploadService.instance = new ImageUploadService();

    return ImageUploadService.instance;
  }
}
