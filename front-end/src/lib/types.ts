export type TlocationData = { latitude: number; longitude: number };

export type TImage = {
  key: string;
  converted: boolean;
  file: File;
  preview: string;
  artist?: string | null;
  locationData: TlocationData | null;
  suburb?: string | null;
};

export type TuploadImage = TImage & {
  converted: boolean;
};

export type TuploadImages = TuploadImage[];
export type TImages = TImage[];

export type Tcoordinates = [number, number];

export type Tmode = "initial" | "explore" | "upload";
