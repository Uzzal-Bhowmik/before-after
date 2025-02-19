import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { ISubcategory } from '../subcategory/subcategory.interface';
import { ICategory } from '../category/category.interface';

export interface ITransformationPost {
  author: ObjectId | IUser;
  subcategory: ObjectId | ISubcategory;
  category: ObjectId | ICategory;
  serviceProvider: ObjectId | IUser
  summary: string;
  description: string;
  beforeStory: string;
  afterStory: string;
  banner: string;
  isDeleted: boolean;
}

export type ITransformationPostModules = Model<
  ITransformationPost,
  Record<string, unknown>
>;
