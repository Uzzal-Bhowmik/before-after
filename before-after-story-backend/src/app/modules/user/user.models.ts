import { Error, Query, Schema, Types, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './user.interface';
import { Role, USER_ROLE } from './user.constants';

const userSchema: Schema<IUser> = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    serviceChargeType: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: null,
    },
    serviceCharge: {
      type: Number,
      default: null,
    },
    phoneNumber: {
      type: String,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Others'],
      default: null,
    },
    dateOfBirth: {
      type: String,
      default: null,
    },
    isGoogleLogin: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Role,
      default: USER_ROLE.user,
    },
    serviceType: {
      type: String,
      default: null,
    },
    aboutMe: {
      type: String,
      default: null,
    },
    services: [
      {
        type: Types.ObjectId,
        ref: 'Subcategory',
        required: false,
      },
    ],
    category: {
      type: Types.ObjectId,
      ref: 'Categories',
    },
    documents: [
      {
        key: {
          type: String,
          default: null,
        },
        url: {
          type: String,
          default: null,
        },
      },
    ],
    location: {
      coordinates: [Number],
      type: { type: String, default: 'Point' },
    },

    reviews: [
      {
        type: Types.ObjectId,
        ref: 'Review',
      },
    ],

    banner: {
      type: String,
      default: null,
    },

    avgRating: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: null,
    },
    needsPasswordChange: {
      type: Boolean,
    },
    passwordChangedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isFreeServiceGiven: {
      type: Boolean,
      default: false,
    },
    verification: {
      otp: {
        type: Schema.Types.Mixed,
        default: 0,
      },
      expiresAt: {
        type: Date,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);
// userSchema.index({ location: '2dsphere' });
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (!user?.isGoogleLogin) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);

// userSchema.pre<Query<IUser[], IUser>>('find', function (next) {
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //@ts-ignore
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

// userSchema.pre<Query<IUser | null, IUser>>('findOne', function (next) {
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //@ts-ignore
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

// userSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
//   next();
// });

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.IsUserExistId = async function (id: string) {
  return await User.findById(id).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
