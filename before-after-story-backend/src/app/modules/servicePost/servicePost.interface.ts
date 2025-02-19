import { Model, ObjectId } from 'mongoose';
import { ICategory } from '../category/category.interface';
import { ISubcategory } from '../subcategory/subcategory.interface';
import { IUser } from '../user/user.interface';
import { IRequest } from './../request/request.interface';

export interface IServicePost {
  deleteKey?: string[];
  title: string;
  category: ObjectId | ICategory;
  user: ObjectId | IUser;
  images: { url: string; key: string }[];
  notInterested: ObjectId[] | IUser[];
  interested: ObjectId[] | IUser[];
  isFree: boolean;
  status: string;
  subcategory: ObjectId | ISubcategory;
  approvedRequest: ObjectId | IRequest;
  description: string;
  consultationType: string;
  isDeleted: boolean;
}

export type IServicePostModules = Model<IServicePost, Record<string, unknown>>;
