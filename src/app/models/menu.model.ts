import { Gastronomy } from './gastronomy.model';
import { Plate } from './Plate';

export interface Menu {
  id?: number;
  nameMenu: string;
  descriptionMenu: string;
  prixMenu: number;
  gastronomy?: Gastronomy;
  plates: Plate[]; // Add this to store the plates for each menu

}

