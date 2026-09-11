export interface CoverageOptions {
  customHoldAmount: number;
}

export interface CustomizeCoverage {
  ultimate: CoverageOptions | null;
  premium: CoverageOptions | null;
  standard: CoverageOptions | null;
  economy: CoverageOptions | null;
  customizedCoverageId: string | null;
}
