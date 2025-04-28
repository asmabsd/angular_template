import { Gastronomy } from './gastronomy.model';

export interface DetailGastronomy {
  id?: number;
  description: string;
  availability: boolean;
  rating: number;
  openingHours?: string;
  gastronomy?: Gastronomy;
}
