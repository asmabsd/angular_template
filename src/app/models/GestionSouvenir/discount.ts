export interface Discount {
    type: 'percentage' | 'fixed' | 'bundle';
    value: number;
    code: string;
    minItems?: number;
    minAmount?: number;
    applicableCategory?: string;
    expiresAt?: Date;
  }