/** Type for file from Multer (memory storage). Use instead of Express.Multer.File when @types/multer is not installed. */
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
