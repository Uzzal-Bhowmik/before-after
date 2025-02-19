import { ObjectId } from 'mongodb';
export enum modeType {
  request = 'Request',
  servicePost = 'ServicePost',
  payment = 'Payment',
}
export interface TNotification {
  receiver: ObjectId;
  message: string;
  description?: string;
  refference: ObjectId;
  model_type: modeType;
  date?: Date;
  read: boolean;
  isDeleted: boolean;
}
