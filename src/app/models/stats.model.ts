// src/app/models/stats.model.ts
export interface UserCounts {
    total: number;
    guides: number;
    travelers: number;
    partners: number;
    newThisMonth: number;
    accommodations?: number; // Check if this property exists

  }
  
  export interface StatusOverview {
    active: number;
    providers: {
      local: number;
      google: number;
    };
  }
  
  export interface TrendData {
    month: string;
    count: number;
  }
  
  export interface DashboardStats {
    userCounts: UserCounts;
    statusOverview: StatusOverview;
    registrationTrend: TrendData[];
    
  }