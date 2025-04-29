import { User } from '../user.model';
import { Souvenir } from './souvenir';
import { storeStatus } from './store-status';

export interface Store {
  id: number;
  name: string;
  address: string;
  description: string;
  phone: string;
  status: storeStatus;
  souvenirs?: Souvenir[]; // Use array instead of Set for easier handling in Angular
  user?: { id: number } ;
} // Only include the user's ID}
