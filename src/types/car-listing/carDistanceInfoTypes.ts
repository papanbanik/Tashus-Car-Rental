import { TPhoto } from '../commonTypes';

export type ServiceLogState = {
  documentInfo?: ServiceLogDocumentInfo;
  serviceDate: string;
  odometer: number;
  nextServiceDate: string;
  nextServiceDueOdometer: number;
  status: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ServiceLogDocumentInfo = {
  info: {
    format: string;
    public_id: string;
    secure_url: string;
  };
  storageProvider?: string;
};

export type CarDataFuelGauge = {
  vehicleKilometersRange: number;
  attachmentOfFuelGauge: TPhoto;
  _id: string;
  createdAt: string;
};
