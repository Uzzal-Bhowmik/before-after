/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import Review from './review.models';
import { IReview } from './review.interface';
import QueryBuilder from '../../builder/QueryBuilder';
// import Product from '../product/product.models';
// import { calculateAverageRatingForProduct } from '../favoriteItem/favoriteItem.utils';
import { User } from '../user/user.models';
import { ObjectId, Types } from 'mongoose';
import { calculateReview } from './review.utils';
import { IUser } from '../user/user.interface';

const createReview = async (payload: IReview) => {
  const serviceProvider = await User.findById(payload?.serviceProvider);
  if (!serviceProvider) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid service provider');
  }
  const result = await Review.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Review creation failed');
  }
  const review = await calculateReview(payload?.serviceProvider);
  console.log(review);
  await User.findByIdAndUpdate(
    payload?.serviceProvider,
    {
      //@ts-ignore
      avgRating: review?.avgRating,
      $addToSet: { reviews: result?._id },
    },
    { new: true, timestamps: false },
  );

  return result;
};

// Get all reviews
const getAllReview = async (query: Record<string, any>) => {
  const reviewModel = new QueryBuilder(
    Review.find().populate(['user', 'serviceProvider']),
    query,
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await reviewModel.modelQuery;
  const meta = await reviewModel.countTotal();
  return {
    data,
    meta,
  };
};

// Get review by ID
const getReviewById = async (id: string) => {
  const result = await Review.findById(id).populate([
    'user',
    'serviceProvider',
  ]);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Review not found');
  }
  return result;
};

// Update review
const updateReview = async (id: string, payload: Partial<IReview>) => {
  const result = await Review.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review update failed');
  }

  // const reviews = await calculateAverageRatingForProduct(result?.product);
  // await User.findByIdAndUpdate(
  //   payload?.product,
  //   // { avgRating: reviews },
  //   { new: true, timestamps: false },
  // );

  return result;
};

// Delete review
const deleteReview = async (id: string) => {
  const result = await Review.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Review deletion failed');
  }

  return result;
};

export const reviewService = {
  createReview,
  getAllReview,
  getReviewById,
  updateReview,
  deleteReview,
};
