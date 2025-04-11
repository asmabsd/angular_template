import { Hebergement } from "./hebergement.model";

export class ReservationChambre {
    id_reservation!: number;
    dateDebut!: Date;
    dateFin!: Date;
    statut!: string;
    prixTotal!: number;
    hebergement!: Hebergement;
    nombreadulte!: number;
    nombrenfant!: number;

  }