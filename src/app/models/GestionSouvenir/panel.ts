import { User } from '../user.model';
import { CommandLineDTO } from './CommandLineDTO';
import { Discount } from './discount';

export interface Panel {
  creationDate: string; // Vous pouvez également utiliser Date si vous gérez les dates
  commandLines: CommandLineDTO[]; // Tableau d'objets CommandLine
  total: number;
  subtotal: number; // <-- Ajouté
  discount?: number;
  appliedDiscountCode?: string;
  totalItems: number;
  appliedDiscount?: {
    code: string;
    value: number;
    type: 'percentage' | 'fixed' | 'bundle';
  };
  user? : {id :number} // Only include the user's ID;
}
