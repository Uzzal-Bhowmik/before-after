/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { IUser } from './user.interface';
import { User } from './user.models';
import {
  IPaginationOption,
  UploadedFiles,
} from '../../interface/common.interface';
import { uploadManyToS3, uploadToS3 } from '../../utils/s3';
import { USER_ROLE, userSearchableFields } from './user.constants';
import { paginationHelper } from '../../helpers/pagination.helpers';
import { Types } from 'mongoose';
export type IFilter = {
  searchTerm?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const createUser = async (payload: IUser): Promise<IUser> => {
  const isExist = await User.isUserExist(payload.email as string);

  if (isExist) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  if (!payload.password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is required');
  }

  const user = await User.create(payload);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
  }
  return user;
};

// const getAllUser = async (
//   filters: IFilter,
//   paginationOptions: IPaginationOption,
// ) => {
//   const { searchTerm, latitude, longitude, ...filtersData } = filters;

//   // Initialize the aggregation pipeline
//   const pipeline: any[] = [];

//   // If latitude and longitude are provided, add $geoNear to the aggregation pipeline

//   if (latitude && longitude) {
//     pipeline.push({
//       $geoNear: {
//         near: {
//           type: 'Point',
//           coordinates: [parseFloat(longitude), parseFloat(latitude)],
//           // coordinates: [90.42308159679541, 23.77634120911962],
//         },
//         key: 'location',
//         // query: {},
//         maxDistance: parseFloat(5 as unknown as string) * 1609, //  5 miles * 1609 => 5000 meters / 5 KM
//         distanceField: 'dist.calculated',
//         spherical: true,
//       },
//     });
//   }

//   pipeline.push({
//     $match: {
//       isDeleted: false,
//     },
//   });

//   // If searchTerm is provided, add a search condition
//   if (searchTerm) {
//     pipeline.push({
//       $match: {
//         $or: userSearchableFields.map(field => ({
//           [field]: {
//             $regex: searchTerm,
//             $options: 'i',
//           },
//         })),
//       },
//     });
//   }

//   // Add custom filters (filtersData) to the aggregation pipeline
//   if (Object.entries(filtersData).length) {
//     Object.entries(filtersData).map(([field, value]) => {
//       if (/^\[.*?\]$/.test(value)) {
//         const match = value.match(/\[(.*?)\]/);
//         const queryValue = match ? match[1] : value;
//         // Add to pipeline if the value is an array-like string
//         pipeline.push({
//           $match: {
//             [field]: { $in: [new Types.ObjectId(queryValue)] }, // Apply $in query with extracted value
//           },
//         });
//         // Remove the field from filtersData to avoid it being used again
//         delete filtersData[field];
//       }
//     });

//     if (Object.entries(filtersData).length) {
//       pipeline.push({
//         $match: {
//           $and: Object.entries(filtersData).map(([field, value]) => ({
//             isDeleted: false,
//             [field]: value,
//           })),
//         },
//       });
//     }
//   }

//   // Sorting condition
//   const { page, limit, skip, sort } =
//     paginationHelper.calculatePagination(paginationOptions);

//   if (sort) {
//     const sortArray = sort.split(',').map(field => {
//       const trimmedField = field.trim();
//       if (trimmedField.startsWith('-')) {
//         return { [trimmedField.slice(1)]: -1 };
//       }
//       return { [trimmedField]: 1 };
//     });

//     pipeline.push({ $sort: Object.assign({}, ...sortArray) });
//   }

//   // Pagination with $skip and $limit
//   pipeline.push({ $skip: skip });
//   pipeline.push({ $limit: limit });

//   // Add $lookup for `reviews`
//   pipeline.push({
//     $lookup: {
//       from: 'reviews',
//       localField: 'reviews',
//       foreignField: '_id',
//       as: 'reviews',
//     },
//   });

//   // Add $lookup for `category`
//   pipeline.push({
//     $lookup: {
//       from: 'categories',
//       localField: 'category',
//       foreignField: '_id',
//       as: 'category',
//     },
//   });

//   // Add $lookup for `services`
//   pipeline.push({
//     $lookup: {
//       from: 'subcategories',
//       localField: 'services',
//       foreignField: '_id',
//       as: 'services',
//     },
//   });

//   const result = await User.aggregate(pipeline);

//   const total = await User.countDocuments({ isDeleted: false, });

//   return {
//     meta: { page, limit, total },
//     data: result,
//   };
// };

const getAllUser = async (
  filters: IFilter,
  paginationOptions: IPaginationOption,
) => {
  const { searchTerm, latitude, longitude, ...filtersData } = filters;

  // Initialize the aggregation pipeline
  const pipeline: any[] = [];

  // If latitude and longitude are provided, add $geoNear to the aggregation pipeline
  if (latitude && longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        key: 'location',
        maxDistance: parseFloat(5 as unknown as string) * 1609, // 5 miles to meters
        distanceField: 'dist.calculated',
        spherical: true,
      },
    });
  }

  // Add a match to exclude deleted documents
  pipeline.push({
    $match: {
      role: { $ne: USER_ROLE.admin },
      isDeleted: false,
    },
  });

  // If searchTerm is provided, add a search condition
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: userSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  // Add custom filters (filtersData) to the aggregation pipeline
  if (Object.entries(filtersData).length) {
    Object.entries(filtersData).map(([field, value]) => {
      if (/^\[.*?\]$/.test(value)) {
        const match = value.match(/\[(.*?)\]/);
        const queryValue = match ? match[1] : value;
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
        delete filtersData[field];
      }
    });

    if (Object.entries(filtersData).length) {
      pipeline.push({
        $match: {
          $and: Object.entries(filtersData).map(([field, value]) => ({
            isDeleted: false,
            [field]: value,
          })),
        },
      });
    }
  }

  // Sorting condition
  const { page, limit, skip, sort } =
    paginationHelper.calculatePagination(paginationOptions);

  if (sort) {
    const sortArray = sort.split(',').map(field => {
      const trimmedField = field.trim();
      if (trimmedField.startsWith('-')) {
        return { [trimmedField.slice(1)]: -1 };
      }
      return { [trimmedField]: 1 };
    });

    pipeline.push({ $sort: Object.assign({}, ...sortArray) });
  }

  // Add $facet to count total and apply pagination
  pipeline.push({
    $facet: {
      totalData: [{ $count: 'total' }], // Count total documents after filters
      paginatedData: [
        { $skip: skip },
        { $limit: limit },
        // Lookups
        {
          $lookup: {
            from: 'reviews',
            localField: 'reviews',
            foreignField: '_id',
            as: 'reviews',
          },
        },

        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: 'subcategories',
            localField: 'services',
            foreignField: '_id',
            as: 'services',
          },
        },
      ],
    },
  });

  // Execute the pipeline
  const [result] = await User.aggregate(pipeline);

  const total = result?.totalData?.[0]?.total || 0; // Get total count
  const data = result?.paginatedData || []; // Get paginated data

  return {
    meta: { page, limit, total },
    data,
  };
};

// const getAllUser = async (
//   filters: IFilter,
//   paginationOptions: IPaginationOption,
// ) => {
//   const { searchTerm, latitude, longitude, ...filtersData } = filters;

//   console.log(latitude, longitude);

//   const andCondition = [];
//   let geoNearCondition = {};
//   if (latitude && longitude) {
//     geoNearCondition = {
//       $geoNear: {
//         near: {
//           type: 'Point',
//           coordinates: [parseFloat(longitude), parseFloat(latitude)],
//           // coordinates: [90.42308159679541, 23.77634120911962],
//         },
//         key: 'location',
//         // query: {},
//         maxDistance: parseFloat(10000 as unknown as string) * 1609,
//         distanceField: 'dist.calculated',
//         spherical: true,
//       },
//     };
//   }

//   if (searchTerm) {
//     andCondition.push({
//       $or: userSearchableFields.map(field => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: 'i',
//         },
//       })),
//     });
//   }

//   if (Object.entries(filtersData).length) {
//     andCondition.push({
//       $and: Object.entries(filtersData)?.map(([field, value]) => ({
//         [field]: [value],
//       })),
//     });
//   }

//   //sorting and pagination
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOptions);

//   const sortConditions: { [key: string]: SortOrder } = {};

//   if (sortBy && sortOrder) {
//     sortConditions[sortBy] = sortOrder;
//   }

//   const whereCondition =
//     andCondition.length > 0
//       ? {
//           ...geoNearCondition,
//           $and: andCondition,
//         }
//       : {};

//   //find collection
//   const result = await User.find(whereCondition)
//     .populate(['category', 'services'])
//     .sort(sortConditions)
//     .skip(skip)
//     .limit(limit);

//   const total = await User.countDocuments();
//   return {
//     meta: { page: page, limit: limit, total: total },
//     data: result,
//   };
// };

const geUserById = async (id: string) => {
  const result = await User.findById(id).populate([
    'category',
    'services',
    {
      path: 'reviews',
      populate: [
        { path: 'user', select: ' name email phone profile phoneNumber' },
      ],
    },
  ]);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const updateUser = async (id: string, payload: Partial<IUser>, files: any) => {
  if (files) {
    const { banner, documents, profile } = files as UploadedFiles;

    //documents
    if (documents?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      documents?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/documents`,
        });
      });

      payload.documents = await uploadManyToS3(imgsArray);
    }

    //banners
    if (banner?.length) {
      payload.banner = (await uploadToS3({
        file: banner[0],
        fileName: `images/user/banner/${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
      })) as string;
    }
    //banners
    if (profile?.length) {
      payload.profile = (await uploadToS3({
        file: profile[0],
        fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
      })) as string;
    }
  }

  const { ...data } = payload;
  const updatePayload: any = { ...data };

  // if (services && Array.isArray(services)) {
  //   updatePayload.$addToSet = { services: { $each: services } };
  // }
  // if (documents && Array.isArray(documents)) {
  //   updatePayload.$addToSet = { documents: { $each: documents } };
  // }
  const user = await User.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User updating failed');
  }

  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user deleting failed');
  }

  return user;
};

export const userService = {
  createUser,
  getAllUser,
  geUserById,
  updateUser,
  deleteUser,
};
