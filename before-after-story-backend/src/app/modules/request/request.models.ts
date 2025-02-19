import { model, Schema } from 'mongoose';
import { IRequest, IRequestModules } from './request.interface';
import { REQUEST_STATUS, requestStatus } from './request.constants';

const requestSchema = new Schema<IRequest>(
  {
    servicePost: {
      type: Schema.Types.ObjectId,
      ref: 'ServicePost',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['cancelled', 'approved', 'pending'],
      default: REQUEST_STATUS.PENDING,
    },
    comment: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Request = model<IRequest, IRequestModules>('Request', requestSchema);
export default Request;
