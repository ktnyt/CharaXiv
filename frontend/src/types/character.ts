export type Character<T> = {
  id: string;
  owner: string;
  system: string;
  name: string;
  ruby: string;
  tags: string[];
  images: string[];
  public: string;
  secret: string;
  data: T;
};
