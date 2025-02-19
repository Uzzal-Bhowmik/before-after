import { model, Schema, Types } from 'mongoose';
import { ISubcategory, ISubcategoryModel } from './subcategory.interface';

const subcategorySchema = new Schema<ISubcategory>(
  {
    name: { type: String, required: true, unique: true },
    banner: { type: String, required: true },
    category: { type: Types.ObjectId, ref: 'Categories', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// filter out deleted documents
subcategorySchema.pre('find', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

subcategorySchema.pre('findOne', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

subcategorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Subcategory = model<ISubcategory, ISubcategoryModel>(
  'Subcategory',
  subcategorySchema,
);
export default Subcategory;
