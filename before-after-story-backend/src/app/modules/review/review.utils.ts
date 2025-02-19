import { ObjectId, Types } from 'mongoose';
import Review from './review.models';
import { IRequest } from './../request/request.interface';

interface IResReview {
  avgRating: number;
  totalReviews: number;
}

export const calculateReview = async (id: any) => {
  const review = await Review.aggregate([
    {
      $match: {
        serviceProvider: new Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: '$serviceProvider',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avgRating = Math.round(review[0]?.avgRating * 10) / 10 || 0;
  const totalReviews = review[0]?.totalReviews || 0;
  return { avgRating, totalReviews };
};
