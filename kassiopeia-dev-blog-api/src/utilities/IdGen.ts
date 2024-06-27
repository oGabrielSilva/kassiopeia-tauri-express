export class IdGen {
  public static async nextId5(): Promise<string> {
    const { randomBytes } = await import('node:crypto');

    return new Promise((resolve, reject) => {
      randomBytes(3, (err, buffer) => {
        if (err) reject(err);
        else resolve(buffer.toString('hex'));
      });
    });
  }
}
