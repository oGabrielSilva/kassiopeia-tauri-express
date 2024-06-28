export interface IStack {
  name: string
  description: string | null
  metaDescription: string
  isLocked: boolean
}

export class Stack implements IStack {
  public constructor(
    public name: string,
    public description: string | null,
    public metaDescription: string,
    public isLocked: boolean,
  ) {}

  public static from(o: Partial<Stack>) {
    if (o instanceof Stack) return o

    return new Stack(
      o.name ?? '',
      o.description ?? null,
      o.metaDescription ?? '',
      o.isLocked ?? false,
    )
  }
}
