import { Hebergement } from './hebergement.model';

export interface User {
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
}

export interface Role {
    // Assuming Role has at least a 'name' property based on your getAuthorities() method
    id: number;
    name: string;
    // Add other Role properties if needed
}

