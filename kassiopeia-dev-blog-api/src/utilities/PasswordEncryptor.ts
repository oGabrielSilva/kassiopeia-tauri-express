import bc from 'bcrypt';

export class PasswordEncryptor {
  private static readonly salt = 10;

  public static async hash(password: string) {
    return await bc.hash(password, PasswordEncryptor.salt);
  }

  public static async compare(password: string, encryptedPassword: string) {
    return await bc.compare(password, encryptedPassword);
  }
}
