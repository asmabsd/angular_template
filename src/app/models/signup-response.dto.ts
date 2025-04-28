// src/app/models/signup-response.dto.ts

import { User } from './user.model'; // adjust path if needed

export interface SignupResponseDto {
  user: User;
  qrCodeUri: string;
}
