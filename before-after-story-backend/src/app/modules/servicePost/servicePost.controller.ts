import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { servicePostService } from './servicePost.service';
import sendResponse from '../../utils/sendResponse';

const createServicePost = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req?.user?.userId;

  const result = await servicePostService.createServicePost(
    req.body,
    req.files,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'ServicePost created successfully',
    data: result,
  });
});

const getMyServicePost = catchAsync(async (req: Request, res: Response) => {
  req.query['user'] = req?.user?.userId;
  const result = await servicePostService.getAllServicePost(
    req.query,
    req.user.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All servicePost fetched successfully',
    data: result,
  });
});

const getAllServicePost = catchAsync(async (req: Request, res: Response) => {
  const result = await servicePostService.getAllServicePost(
    req.query,
    req?.user?.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All servicePost fetched successfully',
    data: result,
  });
});

const getServicePostById = catchAsync(async (req: Request, res: Response) => {
  const result = await servicePostService.getServicePostById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ServicePost fetched successfully',
    data: result,
  });
});

const updateServicePost = catchAsync(async (req: Request, res: Response) => {
  const result = await servicePostService.updateServicePost(
    req.params.id,
    req.body,
    req.files,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ServicePost updated successfully',
    data: result,
  });
});

const notInterested = catchAsync(async (req: Request, res: Response) => {
  const result = await servicePostService.notInterested(
    req?.params?.id,
    req?.user?.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ServicePost set not interested successfully',
    data: result,
  });
});

const completedPost = catchAsync(async (req: Request, res: Response) => {
  const result = await servicePostService.completedPost(req?.params?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ServicePost completed successfully',
    data: result,
  });
});

const deleteServicePost = catchAsync(async (req: Request, res: Response) => {
  const result = await servicePostService.deleteServicePost(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ServicePost deleted successfully',
    data: result,
  });
});

export const servicePostController = {
  createServicePost,
  getAllServicePost,
  getServicePostById,
  updateServicePost,
  deleteServicePost,
  notInterested,
  getMyServicePost,
  completedPost,
};
