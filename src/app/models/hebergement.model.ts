  import { ReservationChambre } from './reservationchambre';
  import { User } from './user.model';
  export enum TypeHebergement {
    hotel = 'hotel',
      maison_hote = 'maison_hote',
      villa = 'villa',
    }

    export class Hebergement {
      id_hebergement: number;

      name: string;
      type: TypeHebergement;
      adresse: string;
      description: string;
      availability: string;
      price: number;
      imageUrl: string;
    
      reservationchambres?: ReservationChambre[];
      user?: User;
      region: string;
      telephone: string;
      nbChambre: string;
      rating: number; // ⭐️ nouvelle propriété
      nombreReservations :number;
      totalSingleChambres: number; // ⭐️ nouvelle propriété
      totalDoubleChambres: number; // ⭐️ nouvelle propriété
      totalSuiteChambres: number; // ⭐️ nouvelle propriété
      totalDelexueChambres: number; // ⭐️ nouvelle propriété
      discountedPrice?: number; // Nouvelle propriété pour le prix remisé

      constructor() {
        this.id_hebergement = 0; // Valeur par défaut
        this.name = '';
        this.type = TypeHebergement.hotel; // Valeur valide de l'énumération
        this.adresse = '';
        this.price = 0;
        this.description = '';
        this.imageUrl = '';
        this.availability = '';

        this.region = ''; // Valeur par défaut vide
        this.telephone = ''; // Valeur par défaut vide
        this.nbChambre = ''; // Valeur par défaut vide
        this.rating = 0; // Valeur par défaut vide
        this.nombreReservations = 0; // Valeur par défaut vide
        this.totalSingleChambres = 0; // Valeur par défaut vide
        this.totalDoubleChambres = 0; // Valeur par défaut vide
        this.totalSuiteChambres = 0; // Valeur par défaut vide
        this.totalDelexueChambres = 0; // Valeur par défaut vide
        this.discountedPrice = undefined; // Pas de remise par défaut

      }
  }
