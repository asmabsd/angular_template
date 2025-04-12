import { Store } from '../GestionSouvenir/store';
import { CategorySouvenir } from './category-souvenir.enum';

export interface Souvenir {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: CategorySouvenir;
  status: string;
  photo: string;
  store?: Store;
}
