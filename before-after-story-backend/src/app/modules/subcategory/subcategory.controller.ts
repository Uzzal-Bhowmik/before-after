import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { uploadToS3 } from '../../utils/s3';
import sendResponse from '../../utils/sendResponse';
import { subcategoryService } from './subcategory.service';

const createSubcategory = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: `images/subcategories/banner/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }

  const result = await subcategoryService.createSubcategory(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllSubcategory = catchAsync(async (req: Request, res: Response) => {
  const result = await subcategoryService.getAllSubcategory(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All subcategories fetched successfully',
    data: result,
  });
});

const getSubcategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await subcategoryService.getSubcategoryById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'subcategory fetched successfully',
    data: result,
  });
});

const updateSubcategory = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: `images/subcategories/banner/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }
  const result = await subcategoryService.updateSubcategory(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'subcategory updated successfully',
    data: result,
  });
});

const deleteSubcategory = catchAsync(async (req: Request, res: Response) => {
  const result = await subcategoryService.deleteSubcategory(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'subCategory deleted successfully',
    data: result,
  });
});

export const subcategoryController = {
  createSubcategory,
  getAllSubcategory,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
