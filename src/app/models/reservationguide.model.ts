import { User } from "./user.model";
import { Guide } from "./guide.model";

export interface ReservationGuide {
  idReservation: number;
  user: User | number;
  guide: Guide | number;
  dateHour: Date;
  duration: string;
  status: string;
  price: number;
  comment: string;
  
}


  