export enum REQUEST_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELED = 'cancelled',
}

export const requestStatus = [
  REQUEST_STATUS.PENDING,
  REQUEST_STATUS.APPROVED,
  REQUEST_STATUS.CANCELED,
];
