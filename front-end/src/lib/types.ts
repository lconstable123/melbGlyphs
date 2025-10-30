export type TlocationData = { latitude: number; longitude: number };

export type TImage = {
  key: string;
  file?: File;
  preview: string;
  artist?: string | null;
  locationData: TlocationData | null;
  suburb?: string | null;
  uploadedAt?: string;
  capped?: string | null;
  fileName: string;
};

export type TuploadImage = TImage & {
  converted: boolean;
};

export type TuploadImages = TuploadImage[];
export type TImages = TImage[];

export type Tcoordinates = [number, number];
export type TPartialImage = Partial<TImage>;
export type Tmode = "initial" | "explore" | "upload";
