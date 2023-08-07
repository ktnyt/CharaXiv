export type Sheet<T> = {
  id: string;
  owner: string;
  system: string;
  name: string;
  data: T;
  tags: string[];
  images: string[];
};
