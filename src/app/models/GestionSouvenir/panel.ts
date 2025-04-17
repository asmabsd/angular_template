import { CommandLineDTO } from "./CommandLineDTO";

export interface Panel {
  creationDate: string; // Vous pouvez également utiliser Date si vous gérez les dates
  commandLines: CommandLineDTO[]; // Tableau d'objets CommandLine
  total: number;
  discount?: number;
  appliedDiscountCode?: string;
  totalItems: number;
}