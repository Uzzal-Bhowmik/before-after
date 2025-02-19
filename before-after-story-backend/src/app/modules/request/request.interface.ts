import { Model, ObjectId } from 'mongoose';
import { IServicePost } from '../servicePost/servicePost.interface';
import { IUser } from '../user/user.interface';

export interface IRequest {
  _id?: ObjectId;
  servicePost: ObjectId | IServicePost;
  user: ObjectId | IUser;
  author: ObjectId | IUser;
  status: 'pending' | 'approved' | 'captured';
  comment: string;
  isDeleted: false;
}

export type IRequestModules = Model<IRequest, Record<string, unknown>>;
