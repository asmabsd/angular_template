import { Blog } from "./blog.model";
import { CategoryA } from "./category-a.enum";
import { User } from "./user.model";

export interface Activity {
  idActivity: number;
  name: string;
  categoryA: CategoryA;
  location: string;
  disponibility: boolean;
  price: number;
  user: User;
  blog: Blog;
}