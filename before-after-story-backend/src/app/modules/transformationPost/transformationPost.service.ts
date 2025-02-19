import httpStatus from 'http-status';
import { ITransformationPost } from './transformationPost.interface';
import TransformationPost from './transformationPost.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createTransformationPost = async (payload: ITransformationPost) => {
  const result = await TransformationPost.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create transformationPost',
    );
  }
  return result;
};

const getAllTransformationPost = async (query: Record<string, any>) => {
  query.isDeleted = false;

  const transformationPostModel = new QueryBuilder(
    TransformationPost.find().populate([
      { path: 'author', select: 'profile name email phoneNumber role' },
      { path: 'category' },
      { path: 'subcategory' },
    ]),
    query,
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await transformationPostModel.modelQuery;
  const meta = await transformationPostModel.countTotal();

  return {
    data,
    meta,
  };
};

const getTransformationPostById = async (id: string) => {
  const result = await TransformationPost.findById(id).populate([
    { path: 'author', select: 'profile name email phoneNumber role' },
    { path: 'category' },
    { path: 'subcategory' },
  ]);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'TransformationPost not found!');
  }
  return result;
};

const updateTransformationPost = async (
  id: string,
  payload: Partial<ITransformationPost>,
) => {
  const result = await TransformationPost.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result || result?.isDeleted) {
    throw new Error('Failed to update TransformationPost');
  }
  return result;
};

const deleteTransformationPost = async (id: string) => {
  const result = await TransformationPost.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete transformationPost',
    );
  }
  return result;
};

export const transformationPostService = {
  createTransformationPost,
  getAllTransformationPost,
  getTransformationPostById,
  updateTransformationPost,
  deleteTransformationPost,
};
