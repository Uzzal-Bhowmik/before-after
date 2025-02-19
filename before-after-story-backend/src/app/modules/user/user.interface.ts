import { ObjectId } from 'mongoose';
import { Model, Types } from 'mongoose';
import { IReview } from '../review/review.interface';

interface map {
  latitude: number;
  longitude: number;
  coordinates: [number];
  type: { type: string };
}

export interface IUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [x: string]: any;
  _id?: Types.ObjectId;
  status: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: 'Male' | 'Female' | 'Others';
  dateOfBirth: string;
  profile: string;
  banner: string;
  role: string;
  serviceType: string;
  isGoogleLogin: boolean;
  location: map;

  aboutMe: string;
  category: ObjectId;
  services: ObjectId[];
  
  documents: { key: string; url: string }[];
  reviews: ObjectId[] | IReview[];
  avgRating: number;
  serviceCharge: number;
  serviceChargeType: string;

  address?: string;
  needsPasswordChange: boolean;
  isFreeServiceGiven: boolean;
  passwordChangedAt?: Date;
  isDeleted: boolean;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>;
  IsUserExistUserName(userName: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
