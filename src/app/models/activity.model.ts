// src/app/models/activity.model.ts
import { Blog } from "./blog.model";
import { CategoryA } from "../services/category-a.enum";
import { Region } from "../services/Region.enum";
import { User } from "./user.model";

export interface Activity {
  idActivity?: number;
  name: string;
  categoryA: CategoryA;
  location: string;
  disponibility: boolean;
  price: number;
  imagePath?: string;
  user: {
    id: number;
  };
  blog?: Blog;
  region: Region;
  likes?: number;
  dislikes?: number;
  // userReaction supprimé, car non utilisé sans authentification

}