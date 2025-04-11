  import { ReservationChambre } from './reservationchambre';
  import { User } from './user.model';
  export enum TypeHebergement {
    hotel = 'hotel',
      maison_hote = 'maison_hote',
      villa = 'villa',
    }

    export class Hebergement {
      id_hebergement?: number;

      name: string;
      type: TypeHebergement;
      adresse: string;
      description: string;
      availability: string;
      price: number;
      imageUrl: string;
    
      reservationchambres?: ReservationChambre[];
      user?: User;

      constructor() {
        this.name = '';
        this.type = TypeHebergement.hotel; // Valeur valide de l'énumération
        this.adresse = '';
        this.price = 0;
        this.description = '';
        this.imageUrl = '';
        this.availability = '';
      }
  }
