import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true, unique: true })
  user_name: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ type: String, default: null })
  password: string | null;

  @Prop({ trim: true, required: true })
  public_name: string;

  @Prop({
    default:
      'https://res.cloudinary.com/dv7kf2cgb/image/upload/v1778361585/vhamfcq7jdteqinoruzw.jpg',
  })
  avatar: String;
}

export const UserSchema = SchemaFactory.createForClass(User);
