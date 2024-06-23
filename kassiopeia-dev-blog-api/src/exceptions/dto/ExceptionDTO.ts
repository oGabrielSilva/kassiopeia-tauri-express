export class ExceptionDTO {
  readonly error = true;
  public constructor(
    public readonly message: string,
    public readonly url: string,
    public readonly timestamp: Date,
    public readonly status: number
  ) {}
}
