import { model, Schema, Types } from 'mongoose';
import {
  ITransformationPost,
  ITransformationPostModules,
} from './transformationPost.interface';

const transformationPostSchema = new Schema<ITransformationPost>(
  {
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceProvider: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    subcategory: {
      type: Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    beforeStory: {
      type: String,
      required: true,
    },
    afterStory: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: false,
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

transformationPostSchema.pre('find', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

transformationPostSchema.pre('findOne', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

transformationPostSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const TransformationPost = model<
  ITransformationPost,
  ITransformationPostModules
>('TransformationPost', transformationPostSchema);
export default TransformationPost;
