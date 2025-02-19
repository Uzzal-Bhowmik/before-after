import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { categoryRoutes } from '../modules/category/category.route';
import { subcategoryRoutes } from '../modules/subcategory/subcategory.route';
import { activityRoutes } from '../modules/activity/activity.route';
import { packagesRoutes } from '../modules/packages/packages.route';
import { paymentsRoutes } from '../modules/payments/payments.route';
import { subscriptionRoutes } from '../modules/subscription/subscription.route';
import { servicePostRoutes } from '../modules/servicePost/servicePost.route';
import { requestRoutes } from '../modules/request/request.route';
import { messagesRoutes } from '../modules/messages/messages.route';
import { chatRoutes } from '../modules/chat/chat.route';
import { transformationPostRoutes } from '../modules/transformationPost/transformationPost.route';
import { contentsRoutes } from '../modules/contents/contents.route';
import { reviewRoutes } from '../modules/review/review.route';
import { commentsRoutes } from '../modules/comments/comments.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/subcategory',
    route: subcategoryRoutes,
  },
  {
    path: '/messages',
    route: messagesRoutes,
  },
  {
    path: '/chats',
    route: chatRoutes,
  },
  {
    path: '/packages',
    route: packagesRoutes,
  },
  {
    path: '/subscriptions',
    route: subscriptionRoutes,
  },
  {
    path: '/activities',
    route: activityRoutes,
  },
  {
    path: '/transformation-posts',
    route: transformationPostRoutes,
  },
  {
    path: '/payments',
    route: paymentsRoutes,
  },
  {
    path: '/service-posts',
    route: servicePostRoutes,
  },
  {
    path: '/requests',
    route: requestRoutes,
  },
  {
    path: '/contents',
    route: contentsRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/comments',
    route: commentsRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
