import { User } from "./user.model";
import { Guide } from "./guide.model";

export interface Planning {
  id: number;
  guide: Guide | number;
  date: Date;
  isReserved: Boolean;
  
}
  
