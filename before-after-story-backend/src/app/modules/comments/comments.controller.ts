import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { commentsService } from './comments.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createComments = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user.userId;
  const result = await commentsService.createComments(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Comments created successfully',
    data: result,
  });
});

const getAllComments = catchAsync(async (req: Request, res: Response) => {
  const result = await commentsService.getAllComments(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All comments fetched successfully',
    data: result,
  });
});

// const getAllComments = catchAsync(async (req: Request, res: Response) => {
//   req.query['post']=req.params.id;
//   const result = await commentsService.getAllComments(req.query);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'All comments fetched successfully',
//     data: result,
//   });
// });

const getCommentsById = catchAsync(async (req: Request, res: Response) => {
  const result = await commentsService.getCommentsById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comments fetched successfully',
    data: result,
  });
});
const updateComments = catchAsync(async (req: Request, res: Response) => {
  const result = await commentsService.updateComments(
    req.params.id,
    req.body,
    req?.user?.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comments updated successfully',
    data: result,
  });
});

const deleteComments = catchAsync(async (req: Request, res: Response) => {
  const result = await commentsService.deleteComments(
    req.params.id,
    req?.user?.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comments deleted successfully',
    data: result,
  });
});

export const commentsController = {
  createComments,
  getAllComments,
  getCommentsById,
  updateComments,
  deleteComments,
};
