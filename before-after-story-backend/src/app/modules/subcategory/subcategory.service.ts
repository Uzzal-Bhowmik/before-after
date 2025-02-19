import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { ISubcategory } from './subcategory.interface';
import Subcategory from './subcategory.models';
import QueryBuilder from '../../builder/QueryBuilder';

const createSubcategory = async (payload: ISubcategory) => {
  const result = await Subcategory.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create subcategory');
  }
  return result;
};

const getAllSubcategory = async (query: Record<string, any>) => {
  const subcategoriesModel = new QueryBuilder(
    Subcategory.find().populate('category'),
    query,
  )
    .search(['name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await subcategoriesModel.modelQuery;
  const meta = await subcategoriesModel.countTotal();

  return {
    data,
    meta,
  };
};

const getSubcategoryById = async (id: string) => {
  const result = await Subcategory.findById(id).populate('category');
  if (!result) {
    throw new Error('subcategory not found');
  }
  return result;
};

const updateSubcategory = async (
  id: string,
  payload: Partial<ISubcategory>,
) => {
  const result = await Subcategory.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('category');
  if (!result) {
    throw new Error('Failed to update subcategory');
  }
  return result;
};

const deleteSubcategory = async (id: string) => {
  const result = await Subcategory.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus?.BAD_REQUEST, 'Failed to delete subcategory');
  }

  // if (result.banner) {
  //  await deleteFromS3(`images/category/${result?.name}`);
  // }

  return result;
};

export const subcategoryService = {
  createSubcategory,
  getAllSubcategory,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
