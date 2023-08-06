export type SheetContent<T> = {
  name: string;
  tags: string[];
  data: T;
  images: string[];
};

export type Sheet<T> = {
  id: string;
  owner: string;
  system: string;
  content: SheetContent<T>;
};
