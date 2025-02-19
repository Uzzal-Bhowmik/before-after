
import { model, Schema, Types } from 'mongoose';
import { IActivity, IActivityModules } from './activity.interface';

const activitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer:{
      type:String,
      default: null, 
    }
    ,
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
    beforeStory: {
      type: String,
      required: true,
    },
    afterStory: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

activitySchema.pre('find', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

activitySchema.pre('findOne', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

activitySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Activity = model<IActivity, IActivityModules>(
  'Activity',
  activitySchema
);
export default Activity;