import { GameSystem } from "./GameSystem";

export type Profile = {
  name: string;
  ruby: string;
  tags: string[];
  images: string[];
  public: string;
  secret: string;
};

export type Character = {
  id: string;
  owner: string;
  profile: Profile;
  systems: Partial<Record<GameSystem, any>>;
};
