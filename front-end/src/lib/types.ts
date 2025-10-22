export type TlocationData = { latitude: number; longitude: number };

export type TselectedImages = {
  key: string;
  converted: boolean;
  file: File;
  preview: string;
  locationData: TlocationData | null;
};
export type Tcoordinates = [number, number];
