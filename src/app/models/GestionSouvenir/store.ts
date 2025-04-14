import { User } from '../user.model';
import { Souvenir } from './souvenir';
import { storeStatus } from './store-status';

export interface Store {
  id: number;
  name: string;
  address: string;
  description: string;
  phone: string;
  status: storeStatus;
  souvenirs?: Souvenir[]; // Use array instead of Set for easier handling in Angular
  user?: User; // Optional, depending on what you expose in your backend
}

// export interface Store {
//   id: number;
//   name: string;
//   address: string;
//   description: string;
//   phone: string;
//   productsCount?: number;
// }

// export const sampleStores: Store[] = [
//   {
//     id: 1,
//     name: "Parisian Memories",
//     address: "18 Rue du Commerce, 75001 Paris, France",
//     description: "Boutique officielle de souvenirs parisiens - produits artisanaux et cadeaux typiques. Collection exclusive de miniatures de monuments.",
//     phone: "+33 1 40 20 53 45",
//     productsCount: 23
//   },
//   {
//     id: 2,
//     name: "London Heritage",
//     address: "45 Regent Street, London W1B 5EA, UK",
//     description: "Authentic British souvenirs including royal memorabilia and traditional teas. Visit us for exclusive Big Ben collectibles!",
//     phone: "+44 20 7930 4832",
//     productsCount: 15
//   },
//   {
//     id: 3,
//     name: "Rome Eternal Treasures",
//     address: "Piazza Navona 12, 00186 Roma, Italia",
//     description: "Artisanal Italian leather goods and Roman empire replicas. Family-owned since 1952. Free worldwide shipping available.",
//     phone: "+39 06 6819 2345",
//     productsCount: 42
//   },
//   {
//     id: 4,
//     name: "Tokyo Kawaii Culture",
//     address: "3-5-1 Shibuya, Tokyo 150-0002, Japan",
//     description: "Official merchandise store for anime lovers. Find limited edition figures, plushies, and traditional Japanese crafts.",
//     phone: "+81 3-5458-1234",
//     productsCount: 67
//   },
//   {
//     id: 5,
//     name: "New York City Landmarks",
//     address: "200 5th Ave, New York, NY 10010, USA",
//     description: "Iconic NYC souvenirs from Statue of Liberty replicas to Broadway memorabilia. Custom engraving available.",
//     phone: "+1 212-555-0189",
//     productsCount: 31
//   }
// ];