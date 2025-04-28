import { Menu } from '../models/menu.model';
import { DetailGastronomy } from '../models/detailgastronomy.model';
import { GastronomyType } from './gastronomy-type.model'; // <--- ici
import { User } from './user.model';


export interface Gastronomy {
  id?: number;
  name: string;
  type: GastronomyType; 
  location: string;
  image?: string;
  menus?: Menu[];
  user?: User;
  detailGastronomy?: DetailGastronomy;
}
