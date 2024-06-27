import { Stack } from '@prisma/client';

export class StackEntity implements Stack {
  public constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public metaDescription: string,
    public isLocked: boolean,
    public createdAt: Date,
    public createdBy: string,
    public updatedAt: Date,
    public updatedBy: string
  ) {}

  public toDTO() {
    const { name, description, metaDescription, isLocked } = this;
    return { name, description, metaDescription, isLocked };
  }

  public static from(o: Partial<StackEntity>) {
    if (o instanceof StackEntity) return o;
    return new StackEntity(
      o.id ?? '',
      o.name ?? '',
      o.description ?? null,
      o.metaDescription ?? '',
      o.isLocked ?? false,
      o.createdAt ?? new Date(),
      o.createdBy ?? '',
      o.updatedAt ?? new Date(),
      o.updatedBy ?? ''
    );
  }
}
