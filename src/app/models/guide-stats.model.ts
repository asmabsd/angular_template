export interface GuideStats {
    totalGuides: number;
    guidesByLanguage: { [key: string]: number };
    guidesBySpeciality: { [key: string]: number };
    averageRatingsByGuide: { [key: string]: number };
    reservationsByGuide: { [key: string]: number };
  }