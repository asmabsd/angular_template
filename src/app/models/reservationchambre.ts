import { Hebergement } from "./hebergement.model";
  export enum TypeChambre {
    single = 'single',
      Double = 'Double',
      Suite = 'Suite',
      Deluxe = 'Deluxe',

    }
export class ReservationChambre {
    id_reservation!: number;
    dateDebut!: Date;
    dateFin!: Date;
    statut!: string;
    prixTotal!: number;
    hebergement!: Hebergement;
    nombreadulte!: number;
    nombrenfant!: number;
    clientEmail?: string; // Nouveau champ
    nombreChambres!: number; // Ajout du nombre de chambres réservées
    typeChambre?: TypeChambre;   // Ajout du type de chambre ('Single', 'Double', etc.)
    
  }