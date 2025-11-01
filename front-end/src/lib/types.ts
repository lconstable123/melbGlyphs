export type TlocationData = { latitude: number; longitude: number };

export type TImage = {
  id: string;
  file?: File;
  // preview: string;
  artist?: string | null;
  locationData: TlocationData | null;
  suburb?: string | null;
  uploadedAt?: string;
  capped?: string | null;
  path: string;
  isOnServer: boolean;
};

export type TuploadImage = TImage & {
  converted: boolean;
};

export type TuploadImages = TuploadImage[];
export type TImages = TImage[];

export type Tcoordinates = [number, number];
export type TPartialImage = Partial<TImage>;
export type Tmode = "initial" | "explore" | "upload";
export type TGQLGetImages = {
  images: TImages;
};
export type GQLResponse = {
  success: boolean;
  message: string;
};
export type TGQLAddImages = {
  addImages: GQLResponse;
};
export type TGQLUpdateImage = {
  updateImage: GQLResponse;
};
export type TGQLDeleteImage = {
  deleteImage: GQLResponse;
};
export type TGQLDeleteImageVars = {
  id: string;
};
export type TGQLUpdateImageVars = {
  id: string;
  updatedData: TPartialImage;
};

export type TGQLAddImagesVars = {
  images: TImages;
};
