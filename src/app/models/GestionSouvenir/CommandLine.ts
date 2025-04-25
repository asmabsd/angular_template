import { command } from './Command';
import { Souvenir } from './souvenir';

export interface CommandLine {
  id: number; // Changed to number to match Long
  souvenir?: Souvenir;
  command?: command;
  quantity: number;
  unitPrice: number;
  createdAt: string; // ISO string from LocalDateTime
}
