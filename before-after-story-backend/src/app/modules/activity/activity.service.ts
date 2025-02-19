import httpStatus from 'http-status';
import { IActivity } from './activity.interface';
import Activity from './activity.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createActivity = async (payload: IActivity) => {
  const result = await Activity.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create activity');
  }
  return result;
};

const getAllActivity = async (query: Record<string, any>) => {
  const activityModel = new QueryBuilder(
    Activity.find().populate([
      { path: 'subcategory' },
      { path: 'category' },
      { path: 'customer', select: 'name email address profile phoneNumber' },
      { path: 'author', select: 'name email address profile phoneNumber' },
    ]),
    query,
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await activityModel.modelQuery;
  const meta = await activityModel.countTotal();

  return {
    data,
    meta,
  };
};

const getActivityById = async (id: string) => {
  const result = await Activity.findById(id).populate([
    { path: 'subcategory' },
    { path: 'category' },
    { path: 'customer', select: 'name email address profile phoneNumber' },
    { path: 'author', select: 'name email address profile phoneNumber' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Activity not found!');
  }
  return result;
};

const updateActivity = async (id: string, payload: Partial<IActivity>) => {
  const result = await Activity.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate(['subcategory', 'category', 'customer']);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Activity');
  }
  return result;
};

const deleteActivity = async (id: string) => {
  const result = await Activity.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete activity');
  }
  return result;
};

export const activityService = {
  createActivity,
  getAllActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
};
