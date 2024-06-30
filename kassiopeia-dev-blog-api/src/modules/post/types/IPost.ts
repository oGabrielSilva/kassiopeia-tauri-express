import { Font, Lang } from '@prisma/client';

export interface IPostPatch extends IPostRequest {
  slug: string;
}

export interface IPostRequest {
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  font: Font;
  stacks: string[];
  lang: Lang;
  editors: string[];
}
