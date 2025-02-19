import { model, Schema, Types } from 'mongoose';
import {
  COMMENT_MODEL_TYPE,
  IComments,
  ICommentsModules,
} from './comments.interface';

const commentsSchema = new Schema<IComments>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    model_type: {
      type: String,
      enum: Object.values(COMMENT_MODEL_TYPE),
    },
    post: {
      type: Schema.Types.ObjectId,
      //   dynamic refference
      refPath: 'model_type',
      required: [true, 'post id is required'],
    },
    comment: {
      type: String,
      required: true,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    replyRef: {
      type: Types.ObjectId,
      ref: 'Comments',
    },
    reply: [
      {
        type: Types.ObjectId,
        ref: 'Comments',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Comments = model<IComments, ICommentsModules>('Comments', commentsSchema);
export default Comments;
