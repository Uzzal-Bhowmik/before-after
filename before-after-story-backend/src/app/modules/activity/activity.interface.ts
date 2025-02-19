import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { ISubcategory } from '../subcategory/subcategory.interface';
import { ICategory } from '../category/category.interface';

export interface IActivity {
  title: string;
  author: ObjectId | IUser;
  customer?: string;
  subcategory: ObjectId | ISubcategory;
  category: ObjectId | ICategory;
  description: string;
  beforeStory: string;
  afterStory: string;
  isDeleted: boolean;
}

export type IActivityModules = Model<IActivity, Record<string, unknown>>;
