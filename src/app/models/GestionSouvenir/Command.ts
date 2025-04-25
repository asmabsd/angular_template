import { CommandLine } from './CommandLine';
import { Souvenir } from './souvenir';

export interface command {
  id: number; // Changed to number to match Long  total: string;
  total: number; // Changed to number to match Long
  createdAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED'; // Matched to backend CommandStatus
  commandLines?: CommandLine[]; // Use array instead of Set for easier handling in Angular
}
