// src/app/models/reservation.model.ts
export interface Reservation {
    idReservation?: number;
    numberOfPeople: number;
    dateReservation: string;
    user: {
      id: number;
    };
    activity: {
      idActivity: number;
    };
  }