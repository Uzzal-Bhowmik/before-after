import httpStatus from 'http-status';
import { IServicePost } from './servicePost.interface';
import ServicePost from './servicePost.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import { IUser } from '../user/user.interface';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';
import { UploadedFiles } from '../../interface/common.interface';
import { uploadManyToS3 } from '../../utils/s3';
import { SERVICE_POST_STATUS } from './servicePost.constants';
import { startSession, Types } from 'mongoose';
import { IRequest } from '../request/request.interface';

const createServicePost = async (payload: IServicePost, files: any) => {
  if (files) {
    const { images } = files as UploadedFiles;

    //documents
    if (images) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/service/images`,
        });
      });

      payload.images = await uploadManyToS3(imgsArray);
    }
  }

  const result = await ServicePost.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create servicePost');
  }

  const users: IUser[] | null = await User.find({
    services: { $all: [result?.subcategory] },
  });

  if (users) {
    users?.map(async (user: IUser) => {
      notificationServices.insertNotificationIntoDb({
        receiver: user?._id,
        message: `New service posted in your interest category: ${result?.title}`,
        description: `Dear ${user?.name}, a new service post titled "${result?.title}" has been added. Check it out!`,
        refference: result?._id,
        model_type: modeType.servicePost,
      });
    });
  }

  return result;
};

const getAllServicePost = async (
  query: Record<string, any>,
  userId: string,
) => {
  const servicePostModel = new QueryBuilder(
    ServicePost.find({
      notInterested: { $nin: [new Types.ObjectId(userId)] },
      interested: { $nin: [new Types.ObjectId(userId)] },
      isDeleted: false,
    }).populate([
      { path: 'notInterested', select: 'name email phoneNumber role profile' },
      { path: 'user', select: 'name email phoneNumber role profile' },
      { path: 'subcategory' },
      { path: 'category' },
      { path: 'approvedRequest' },
    ]),
    query,
  )
    .search(['title', 'status', 'consultationType'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await servicePostModel.modelQuery;
  const meta = await servicePostModel.countTotal();

  return {
    data,
    meta,
  };
};

const getServicePostById = async (id: string) => {
  const result = await ServicePost.findById(id).populate([
    { path: 'notInterested', select: 'name email phoneNumber role profile' },
    { path: 'user', select: 'name email phoneNumber role profile' },
    { path: 'subcategory' },
    { path: 'category' },
    { path: 'approvedRequest' },
  ]);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'ServicePost not found!');
  }
  return result;
};
const updateServicePost = async (
  id: string,
  payload: Partial<IServicePost>,
  files: any,
) => {
  const { images } = payload;
  if (files) {
    const { images } = files as UploadedFiles;

    //documents
    if (images) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/service/images`,
        });
      });

      payload.images = await uploadManyToS3(imgsArray);
    }
  }

  if (images && images?.length > 0)
    images?.map(img => payload.images?.push(img));

  const result = await ServicePost.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate([
    { path: 'notInterested', select: 'name email phoneNumber role profile' },
    { path: 'user', select: 'name email phoneNumber role profile' },
    { path: 'subcategory' },
    { path: 'category' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update ServicePost');
  }
  return result;
};

const notInterested = async (id: string, userId: string) => {
  const result = await ServicePost.findByIdAndUpdate(
    id,
    { $addToSet: { notInterested: userId } },
    { new: true },
  ).populate([
    { path: 'notInterested', select: 'name email phoneNumber role profile' },
    { path: 'user', select: 'name email phoneNumber role profile' },
    { path: 'subcategory' },
    { path: 'category' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to set notInterested');
  }
  return result;
};

const completedPost = async (id: string) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Update the ServicePost status to COMPLETE
    const result = await ServicePost.findByIdAndUpdate(
      id,
      { status: SERVICE_POST_STATUS.COMPLETE },
      { new: true, session },
    ).populate([
      {
        path: 'notInterested',
        select: 'name email phoneNumber role profile',
      },
      { path: 'user', select: 'name email phoneNumber role profile' },
      { path: 'subcategory' },
      { path: 'category' },
      { path: 'approvedRequest' },
    ]);

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to complete post');
    }

    // If the post is free, update the user's `isFreeServiceGiven` status
    if (result.isFree) {
      const userUpdate = await User.findByIdAndUpdate(
        (result?.approvedRequest as IRequest)?.user,
        { isFreeServiceGiven: true },
        { new: true, upsert: false, session },
      );

      if (!userUpdate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update user free service status',
        );
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    return result;
  } catch (error: any) {
    // Rollback the transaction
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  } finally {
    session.endSession();
  }
};

// const completedPost = async (id: string, serviceProviderId: string) => {
//   const result = await ServicePost.findByIdAndUpdate(
//     id,
//     { status: SERVICE_POST_STATUS.COMPLETE },
//     { new: true },
//   ).populate([
//     {
//       path: 'notInterested',
//       select: 'name email phoneNumber role profile',
//     },
//     { path: 'user', select: 'name email phoneNumber role profile' },
//     { path: 'subcategory' },
//     { path: 'category' },
//   ]);
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to complete post');
//   }
// if (result?.isFree) await User.findByIdAndUpdate(serviceProviderId,{isFreeServiceGiven: true},{new:true, upsert:false});
//   return result;
// };

const deleteServicePost = async (id: string) => {
  const result = await ServicePost.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete servicePost');
  }
  return result;
};

export const servicePostService = {
  createServicePost,
  getAllServicePost,
  getServicePostById,
  updateServicePost,
  deleteServicePost,
  notInterested,
  completedPost,
};
