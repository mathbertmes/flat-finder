export interface Flat {
  userId: string;
  userFullName: string;
  userEmail: string;
  city: string;
  streetNumber: number;
  areaSize: number;
  hasAc: boolean;
  yearBuild: number;
  rentPrice: number;
  dataAvailable: Date;
  message: {
    flatDocument: string;
    userId: string;
    timestamp: Date;
    fromUserFirstName: string;
    fromUserLastName: string;
    fromUserEmail: string;
  }[];
}
