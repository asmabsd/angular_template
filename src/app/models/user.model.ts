import { Hebergement } from './hebergement.model';

export class User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  nTel?: string;
  numPasseport?: string;
  role?: Role;
  authProvider?: 'LOCAL' | 'GOOGLE';
  hebergements?: Hebergement[];

  // Constructeur
  constructor(
    id: number,
    email: string,
    password: string
   
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    
  }
}

export interface Role {
  id: number;
  name: string;
}
