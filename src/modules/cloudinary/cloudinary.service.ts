import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  async uploadImage(filePath: string) {
    try {
      const result = await cloudinary.uploader.upload(filePath);
      
      fs.unlinkSync(filePath); 
      
      return result;
    } catch (error) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      throw error;
    }
  }
}