import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';

export enum COMMENT_MODEL_TYPE {
  transformationPost = 'TransformationPost',
  activity = 'Activity',
}

export interface IComments {
  user: ObjectId | IUser;
  model_type: COMMENT_MODEL_TYPE;
  post: ObjectId;
  comment: string;
  isReply: boolean;
  replyRef?:ObjectId | IComments
  reply: ObjectId[] | IComments;
}

export type ICommentsModules = Model<IComments, Record<string, unknown>>;
