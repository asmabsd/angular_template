import { Activity } from "./activity.model";
import { Region } from "../services/Region.enum";
import { User } from "./user.model";

export interface Blog {
  idBlog?: number;
  title?: string;
  content?: string;
  publication?: string;
  region?: Region;
  user?: User;
  activities?:Activity[];
}