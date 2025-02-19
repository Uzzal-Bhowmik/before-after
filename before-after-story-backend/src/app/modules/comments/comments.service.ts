import httpStatus from 'http-status';
import { IComments } from './comments.interface';
import Comments from './comments.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createComments = async (payload: IComments) => {
  // Start a MongoDB session
  const session = await Comments.startSession();
  session.startTransaction();

  try {
    // Create the comment within the transaction
    const result = await Comments.create([payload], { session });

    if (!result || result.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create comments');
    }

    const createdComment = result[0];

    if (createdComment.isReply) {
      const updateResult = await Comments.findByIdAndUpdate(
        createdComment.replyRef,
        {
          $addToSet: { reply: createdComment._id },
        },
        { new: true, session },
      );

      if (!updateResult) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update reply reference',
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    return createdComment;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getAllComments = async (query: Record<string, any>) => {
  const commentsModel = new QueryBuilder(
    Comments.find().populate([
      { path: 'user', select: 'name email phoneNumber profile' },
      { path: 'post' },
      { path: 'replyRef' },
      {
        path: 'reply',
        populate: { path: 'user', select: 'name email phoneNumber profile' },
      },
    ]),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await commentsModel.modelQuery;
  const meta = await commentsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getCommentsById = async (id: string) => {
  const result = await Comments.findById(id).populate([
    { path: 'user', select: 'name email phoneNumber profile' },
    { path: 'post' },
    { path: 'replyRef' },
    {
      path: 'reply',
      populate: { path: 'user', select: 'name email phoneNumber profile' },
    },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Comments not found!');
  }
  return result;
};

const updateComments = async (
  id: string,
  payload: Partial<IComments>,
  userId: string,
) => {
  const comment = await Comments.findById(id);
  if (comment?.user?.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Unauthorized to Update this comment',
    );
  }
  const result = await Comments.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate([
    { path: 'user', select: 'name email phoneNumber profile' },
    { path: 'post' },
    { path: 'replyRef' },
    { path: 'reply' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Comments');
  }
  return result;
};

const deleteComments = async (id: string, userId: string) => {
  const comment = await Comments.findById(id);
  if (comment?.user?.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Unauthorized to delete this comment',
    );
  }
  const result = await Comments.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete comments');
  }
  return result;
};

export const commentsService = {
  createComments,
  getAllComments,
  getCommentsById,
  updateComments,
  deleteComments,
};
