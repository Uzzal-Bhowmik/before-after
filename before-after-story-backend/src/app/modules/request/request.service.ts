import httpStatus from 'http-status';
import { IRequest } from './request.interface';
import Request from './request.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { REQUEST_STATUS } from './request.constants';
import ServicePost from '../servicePost/servicePost.models';
import { SERVICE_POST_STATUS } from '../servicePost/servicePost.constants';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';
import { startSession, Types } from 'mongoose';
import { IServicePost } from '../servicePost/servicePost.interface';

const createRequest = async (payload: IRequest) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // Find the service post
    const post: IServicePost | null = await ServicePost.findById(
      payload.servicePost,
    ).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Service post not found');
    }

    payload.author = post?.user;

    // Create the request
    const result = await Request.create([payload], { session });
    if (!result || result.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create request');
    }

    // Update the service post with interested user
    const updateResult = await ServicePost.findByIdAndUpdate(
      result[0]?.servicePost,
      {
        $addToSet: { interested: result[0]?.user },
      },
      {
        session,
        upsert: false,
      },
    );
    if (!updateResult) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update service post',
      );
    }

    await notificationServices.insertNotificationIntoDb({
      receiver: result[0]?.author,
      message: `New Request for Your Service: ${post?.title}`,
      description: `A service provider has requested your service post. Please review the request and take necessary action.`,
      refference: result[0]?._id,
      model_type: modeType.request,
    });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error: any) {
    // Rollback the transaction
    await session.abortTransaction();
    session.endSession();

    // Propagate the error
    throw new AppError(httpStatus.BAD_REQUEST, error?.messag);
  }
};

const getAllRequest = async (query: Record<string, any>) => {
  const requestModel = new QueryBuilder(
    Request.find({ isDeleted: false }).populate([
      {
        path: 'user',
        select: ' name email phoneNumber profile role serviceType',
      },
      {
        path: 'author',
        select: ' name email phoneNumber profile role serviceType',
      },
      {
        path: 'servicePost',
        populate: [{ path: 'category' }, { path: 'subcategory' }],
      },
    ]),
    query,
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await requestModel.modelQuery;
  const meta = await requestModel.countTotal();

  return {
    data,
    meta,
  };
};

const getRequestById = async (id: string) => {
  const result = await Request.findById(id).populate([
    {
      path: 'user',
      select: ' name email phoneNumber profile role serviceType',
    },
    {
      path: 'author',
      select: ' name email phoneNumber profile role serviceType',
    },
    {
      path: 'servicePost',
      populate: [{ path: 'category' }, { path: 'subcategory' }],
    },
  ]);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus?.BAD_REQUEST, 'Request not found!');
  }
  return result;
};

const updateRequest = async (id: string, payload: Partial<IRequest>) => {
  const result = await Request.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate([
    {
      path: 'user',
      select: ' name email phoneNumber profile role serviceType',
    },
    {
      path: 'author',
      select: ' name email phoneNumber profile role serviceType ',
    },
    { path: 'servicePost' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Request');
  }
  return result;
};

const approvedRequest = async (id: string) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Update the request status to APPROVED
    const result = await Request.findByIdAndUpdate(
      id,
      { status: REQUEST_STATUS.APPROVED },
      { new: true, session },
    );

    if (!result) {
      throw new AppError(
        httpStatus?.BAD_REQUEST,
        'Failed to approve the request',
      );
    }

    // Update the associated ServicePost status to ONGOING
    const servicePost = await ServicePost.findByIdAndUpdate(
      result?.servicePost,
      {
        status: SERVICE_POST_STATUS.ONGOING,
        approvedRequest: result?._id,
      },
      { session },
    ).populate('user');

    if (!servicePost) {
      throw new AppError(
        httpStatus?.BAD_REQUEST,
        'Failed to update ServicePost status',
      );
    }

    // Insert notification into the database
    await notificationServices.insertNotificationIntoDb({
      receiver: result?.user,
      message: `Your request for the service "${servicePost.title}" has been approved.`,
      description: `Dear User, your request for "${servicePost.title}" post has been approved and the service is now you can contact`,
      refference: result?._id,
      model_type: modeType.request,
    });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    // Rollback changes in case of an error
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.BAD_REQUEST,
      'request approving failed: ' + error?.message,
    );
  }
};

const canceledRequest = async (id: string) => {
  // Update the request status to APPROVED
  const result: null | IRequest = await Request.findByIdAndUpdate(
    id,
    { status: REQUEST_STATUS.CANCELED },
    { new: true },
  ).populate('servicePost');

  if (!result) {
    throw new AppError(
      httpStatus?.BAD_REQUEST,
      'Failed to canceled the request',
    );
  }
  // Insert notification into the database
  await notificationServices.insertNotificationIntoDb({
    receiver: result?.user,
    message: `OOps! Your request for the service "${(result?.servicePost as IServicePost)?.title}" has been canceled.`,
    description: `Dear User, your request for "${(result?.servicePost as IServicePost)?.title}" post has been canceled by post author`,
    refference: result?._id,
    model_type: modeType.request,
  });

  return result;
};

const deleteRequest = async (id: string) => {
  const result = await Request.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete request');
  }
  return result;
};

export const requestService = {
  createRequest,
  getAllRequest,
  getRequestById,
  updateRequest,
  deleteRequest,
  approvedRequest,
  canceledRequest,
};
