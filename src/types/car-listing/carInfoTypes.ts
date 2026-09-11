export type LicensePlateState = {
  number: string;
  state: string;
};

export type FuelInfo = {
  fuelType: string;
  unitPrice: number;
  unitName: string;
};

export type CarState = {
  licensePlate: LicensePlateState;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  carType: string;
  seats: number;
  doors: number;
  windows: number;
  fuelType: string;
  fuelInfo?: FuelInfo;
  transmissionType: string;
  mileage: CarDataMileage;
  trim: string;
  expiry: string;
};

export type CarAdditionalInfosState = {
  carDescription: string;
  guidelines: string;
};

export type CarDataMileage = {
  distance: number;
  units: string;
};

export type VehicleObligationsState = {
  neverWrittenOff: boolean;
  ctpInsurance: boolean;
};
