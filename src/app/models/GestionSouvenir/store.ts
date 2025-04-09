import { User } from '../user.model';
import { Souvenir } from './souvenir';

export interface Store {
  id: number;
  name: string;
  address: string;
  description: string;
  phone: string;
  souvenirs?: Souvenir[]; // Use array instead of Set for easier handling in Angular
  user?: User; // Optional, depending on what you expose in your backend
}
