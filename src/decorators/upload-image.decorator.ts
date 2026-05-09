// decorators/upload-image.decorator.ts
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function UploadImage(fieldName: string = 'file') {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: './temp',
          filename: (req, file, cb) => {
            const name = Date.now() + extname(file.originalname);
            cb(null, name);
          },
        }),
      }),
    ),
  );
}