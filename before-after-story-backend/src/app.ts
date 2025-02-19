/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notfound';
import router from './app/routes';
import catchAsync from './app/utils/catchAsync';
import AppError from './app/error/AppError';
import httpStatus from 'http-status';
import multer, { memoryStorage } from 'multer';
import { uploadManyToS3 } from './app/utils/s3';
import sendResponse from './app/utils/sendResponse';
import { UploadedFiles } from './app/interface/common.interface';
const app: Application = express();
app.use(express.static('public'));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// Remove duplicate static middleware
// app.use(app.static('public'));
const storage = memoryStorage();
const upload = multer({ storage });

 
app.post(
  '/api/v1/upload',
  upload.fields([{ name: 'images', maxCount: 5 }]),
  catchAsync(async (req: express.Request, res: express.Response) => {
    let imagUrl;
    if (!req.files) {
      throw new AppError(httpStatus.BAD_REQUEST, 'image is required');
    }
    const { images } = req.files as UploadedFiles;
    if (images) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `message/images`,
        });
      });

      imagUrl = await uploadManyToS3(imgsArray); 
    }
    console.log(imagUrl)

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Image uploaded successfully',
      data: imagUrl,
    });
  }),
);

app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
