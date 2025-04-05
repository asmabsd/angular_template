import { Activity } from "./activity.model";
import { User } from "./user.model";

export interface Blog {
  idBlog?: number;
  title: string;
  content: string;
  publication: string;
  user?: User;
  activities?:Activity[];
}