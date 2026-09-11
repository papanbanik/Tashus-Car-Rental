import { z } from 'zod';
export const StorageProviders = ['aws', 'azure', 'cloudinary'] as unknown as [string, ...string[]];
export const driverAssignedDetailsSchema = z.object({
  driverId: z.string(),
  driverName: z.string(),
  notes: z.string().min(5, 'Notes is required'),
  adminId: z.string(),
  adminUserName: z.string(),
});

export const PhoneNumberSchema = z
  .object({
    countryCode: z.string().min(1, 'Country code is required'), // e.g., "+1" for the USA
    areaCode: z.string().optional(), // e.g., "415" for San Francisco
    number: z.string().min(1, 'Phone number is required'), // e.g., "555-1234"
    type: z.enum(['mobile', 'home', 'work']).optional(), // Optional type of phone number
    isVerified: z.boolean().default(false),
  })
  .strict();
export const PhotoSchema = z
  .object({
    secureUrl: z.string(),
    publicId: z.string(),
    format: z.string(),
    storageProvider: z.enum(StorageProviders),
  })
  .strict();
