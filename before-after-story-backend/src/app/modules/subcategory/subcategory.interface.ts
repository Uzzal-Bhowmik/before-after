import { Model, ObjectId } from 'mongoose';

export interface ISubcategory {
  name: string;
  category: ObjectId;
  banner: string;
  isDeleted: boolean;
}

export type ISubcategoryModel = Model<ISubcategory, Record<string, unknown>>;
