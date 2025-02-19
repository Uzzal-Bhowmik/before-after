import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { transformationPostService } from './transformationPost.service';
import sendResponse from '../../utils/sendResponse';
import { UploadedFiles } from '../../interface/common.interface';
import { uploadToS3 } from '../../utils/s3';

const createTransformationPost = catchAsync(
  async (req: Request, res: Response) => {

     if (req.files) {
       const { afterStory, beforeStory, banner } = req.files as UploadedFiles;

       if (beforeStory) {
         req.body.beforeStory = await uploadToS3({
           file: beforeStory[0],
           fileName: `images/stories/${Math.floor(100000 + Math.random() * 900000)}`,
         });
       }

       if (afterStory) {
         req.body.afterStory = await uploadToS3({
           file: afterStory[0],
           fileName: `images/stories/${Math.floor(100000 + Math.random() * 900000)}`,
         });
       }
       if (banner) {
         req.body.banner = await uploadToS3({
           file: banner[0],
           fileName: `images/banner/${Math.floor(100000 + Math.random() * 900000)}`,
         });
       }
     }


    req.body.author = req.user.userId;
    const result = await transformationPostService.createTransformationPost(
      req.body,
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'TransformationPost created successfully',
      data: result,
    });
  },
);

const getAllTransformationPost = catchAsync(
  async (req: Request, res: Response) => {
    const result = await transformationPostService.getAllTransformationPost(
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All transformationPost fetched successfully',
      data: result,
    });
  },
);
const getMyTransformationPost = catchAsync(
  async (req: Request, res: Response) => {
    req.query['author'] = req.user.userId;
    const result = await transformationPostService.getAllTransformationPost(
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'my transformationPost fetched successfully',
      data: result,
    });
  },
);

const getTransformationPostById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await transformationPostService.getTransformationPostById(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'TransformationPost fetched successfully',
      data: result,
    });
  },
);
const updateTransformationPost = catchAsync(
  async (req: Request, res: Response) => {

      if (req.files) {
        const { afterStory, beforeStory, banner } = req.files as UploadedFiles;

        if (beforeStory) {
          req.body.beforeStory = await uploadToS3({
            file: beforeStory[0],
            fileName: `images/stories/${Math.floor(100000 + Math.random() * 900000)}`,
          });
        }

        if (afterStory) {
          req.body.afterStory = await uploadToS3({
            file: afterStory[0],
            fileName: `images/stories/${Math.floor(100000 + Math.random() * 900000)}`,
          });
        }
        if (banner) {
          req.body.banner = await uploadToS3({
            file: banner[0],
            fileName: `images/banner/${Math.floor(100000 + Math.random() * 900000)}`,
          });
        }
      }
    const result = await transformationPostService.updateTransformationPost(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'TransformationPost updated successfully',
      data: result,
    });
  },
);

const deleteTransformationPost = catchAsync(
  async (req: Request, res: Response) => {
    const result = await transformationPostService.deleteTransformationPost(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'TransformationPost deleted successfully',
      data: result,
    });
  },
);

export const transformationPostController = {
  createTransformationPost,
  getAllTransformationPost,
  getTransformationPostById,
  updateTransformationPost,
  deleteTransformationPost,
  getMyTransformationPost,
};
