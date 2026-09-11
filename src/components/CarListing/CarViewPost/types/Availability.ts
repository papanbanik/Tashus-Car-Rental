export interface CustomHour {
    startTime: Date;
    endTime: Date;
    status: string;
  }
  
export interface CustomAvailability {
    dayOfWeek: string;
    availability: string;
    customHours: CustomHour[];
  }