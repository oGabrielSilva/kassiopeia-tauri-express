import { PrismaClient } from '@prisma/client';

export class DBClient {
  private static client: PrismaClient;

  public static get() {
    if (!DBClient.client) {
      DBClient.client = new PrismaClient();
    }
    return DBClient.client;
  }
}
