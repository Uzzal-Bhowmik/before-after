import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { requestService } from './request.service';
import sendResponse from '../../utils/sendResponse';

const createRequest = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user.userId;
  const result = await requestService.createRequest(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Request created successfully',
    data: result,
  });
});

const getAllRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.getAllRequest(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All request fetched successfully',
    data: result,
  });
});

const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  req.query['user'] = req.user.userId;
  const result = await requestService.getAllRequest(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All request fetched successfully',
    data: result,
  });
});

const getRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.getRequestById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Request fetched successfully',
    data: result,
  });
});

const updateRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.updateRequest(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Request updated successfully',
    data: result,
  });
});

const approvedRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.approvedRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Request approved successfully',
    data: result,
  });
});
const canceledRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.canceledRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Request canceled successfully',
    data: result,
  });
});

const deleteRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.deleteRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Request deleted successfully',
    data: result,
  });
});

export const requestController = {
  createRequest,
  getAllRequest,
  getRequestById,
  updateRequest,
  deleteRequest,
  approvedRequest,
  getMyRequests,
  canceledRequest,
};
