export interface Guide {
  id: number;
  name: string;
  language: string;
  speciality: string;
  experience: string;
  averageRating: string;
  availability: string;
  contact: string;
  image?: string; // base64 string
  imagePath?: string; // filled by backend
}
