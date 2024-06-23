export class Exception {
  readonly error = true
  public constructor(
    public readonly message: string,
    public readonly url: string,
    public readonly timestamp: Date,
    public readonly status: number,
  ) {}

  public static from(o: any) {
    if (o instanceof Exception) return o
    return new Exception(
      o.message ?? '',
      o.url ?? '',
      o.timestamp ?? null,
      o.status ?? 0,
    )
  }
}
