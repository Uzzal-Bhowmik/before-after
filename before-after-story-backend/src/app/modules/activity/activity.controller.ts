import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { activityService } from './activity.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';
import { UploadedFiles } from '../../interface/common.interface';

const createActivity = catchAsync(async (req: Request, res: Response) => {
  if (req.files) {
    const { afterStory, beforeStory } = req.files as UploadedFiles;

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
  }

  req.body.author = req?.user?.userId;

  const result = await activityService.createActivity(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Activity created successfully',
    data: result,
  });
});

const getAllActivity = catchAsync(async (req: Request, res: Response) => {
  const result = await activityService.getAllActivity(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All activity fetched successfully',
    data: result,
  });
});

const getMyActivity = catchAsync(async (req: Request, res: Response) => {
  req.query['author'] = req?.user?.userId;
  const result = await activityService.getAllActivity(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All activity fetched successfully',
    data: result,
  });
});

const getActivityById = catchAsync(async (req: Request, res: Response) => {
  const result = await activityService.getActivityById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Activity fetched successfully',
    data: result,
  });
});

const updateActivity = catchAsync(async (req: Request, res: Response) => {
  if (req.files) {
    const { afterStory, beforeStory } = req.files as UploadedFiles;

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
  }

  const result = await activityService.updateActivity(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Activity updated successfully',
    data: result,
  });
});

const deleteActivity = catchAsync(async (req: Request, res: Response) => {
  const result = await activityService.deleteActivity(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Activity deleted successfully',
    data: result,
  });
});

export const activityController = {
  createActivity,
  getAllActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
  getMyActivity,
};
