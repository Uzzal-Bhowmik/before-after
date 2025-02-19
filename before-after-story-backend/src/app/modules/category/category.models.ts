import { model, Schema } from 'mongoose';
import { ICategory, ICategoryModel } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: 'string', required: true, unique: true },
    banner: { type: 'string', required: false },
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  },
);

// filter out deleted documents
categorySchema.pre('find', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('findOne', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Category = model<ICategory, ICategoryModel>('Categories', categorySchema);
export default Category;
