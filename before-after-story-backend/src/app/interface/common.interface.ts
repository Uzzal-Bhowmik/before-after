// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface UploadedFiles {
  image?: Express.Multer.File[];
  banner?: Express.Multer.File[];
  profile?: Express.Multer.File[];
  images?: Express.Multer.File[];
  beforeStory?: Express.Multer.File[];
  afterStory?: Express.Multer.File[];
  videos?: Express.Multer.File[];
  documents?: Express.Multer.File[];
}

export type IPaginationOption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};