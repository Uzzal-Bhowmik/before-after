import { model, Schema, Types } from 'mongoose';
import { IServicePost, IServicePostModules } from './servicePost.interface';
import {
  SERVICE_POST_STATUS,
  servicePostStatus,
} from './servicePost.constants';

const servicePostSchema = new Schema<IServicePost>(
  {
    title: {
      type: String,
      required: true,
      default: null,
    },
    category: {
      type: Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    images: [
      {
        url: {
          type: String,
        },
        key: {
          type: String,
        },
      },
    ],
    subcategory: {
      type: Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedRequest: {
      type: Types.ObjectId,
      ref: 'Request',
      required: false,
    },
    notInterested: [
      {
        type: Types.ObjectId,
        ref: 'User',
        default: null,
      },
    ],
    interested: [
      {
        type: Types.ObjectId,
        ref: 'User',
        default: null,
      },
    ],
    status: {
      type: String,
      enum: servicePostStatus,
      default: SERVICE_POST_STATUS.PENDING,
    },

    description: {
      type: String,
      required: true,
      default: null,
    },
    consultationType: {
      type: String,
      required: true,
      default: null,
    },
    isFree: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// servicePostSchema.pre('find', function (next) {
//   //@ts-ignore
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

// servicePostSchema.pre('findOne', function (next) {
//   //@ts-ignore
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

// servicePostSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
//   next();
// });

const ServicePost = model<IServicePost, IServicePostModules>(
  'ServicePost',
  servicePostSchema,
);
export default ServicePost;
