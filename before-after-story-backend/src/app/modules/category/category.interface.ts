import { Model } from 'mongoose';

export interface ICategory {
  name: string; 
  banner: string;
  isDeleted: boolean;
}

export type ICategoryModel = Model<ICategory, Record<string, unknown>>;
