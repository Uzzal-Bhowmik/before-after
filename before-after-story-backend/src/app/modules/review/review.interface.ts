import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

export interface IReview {
  user: ObjectId;
  serviceProvider: ObjectId;
  rating: number;
  comment: string;
}

export type IReviewModel = Model<IReview, Record<string, unknown>>;
