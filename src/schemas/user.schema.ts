import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BloodType } from './enums/blood-type.enum';
import { RhFactor } from './enums/rh-factor.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {

  @Prop({ required: true, trim: true })
  first_name: string;

  @Prop({ required: true, trim: true })
  last_name: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ type: String, default: null })
  password: string | null;

  @Prop({ required: true })
  birth_date: Date;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({
    default:
      'https://res.cloudinary.com/dv7kf2cgb/image/upload/v1778361585/vhamfcq7jdteqinoruzw.jpg',
  })
  avatar: string;

  @Prop({ type: String, trim: true, default: null })
  phone: string | null;

  @Prop({ type: String, trim: true, default: null })
  passport_number: string | null;

  @Prop({ type: String, trim: true, default: null })
  home_address: string | null;

  @Prop({ type: String, trim: true, default: null })
  work_place: string | null;

  @Prop({ type: [{ name: String, phone: String }], default: [] })
  emergency_contact: { name: string; phone: string }[];

  @Prop({ type: String, enum: BloodType, default: null })
  blood_type: BloodType | null;

  @Prop({ type: String, enum: RhFactor, default: null })
  rh_factor: RhFactor | null;

  @Prop({ type: String, trim: true, default: null })
  chronic_diseases: string | null;

  @Prop({ type: [String], default: [] })
  medicine: string[];

  @Prop({ type: [String], default: [] })
  allergies: string[];

  @Prop({ type: [String], default: [] })
  implants: string[];

  @Prop({ type: [Types.ObjectId], default: [] })
  animals: Types.ObjectId[];

  @Prop({ type: String, trim: true, default: null })
  note_about: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('profileComplete').get(function () {
  const checks: boolean[] = [
    !!this.first_name,
    !!this.last_name,
    !!this.email,
    !!this.birth_date,
    !!this.country,
    !!this.phone,
    !!this.passport_number,
    !!this.home_address,
    !!this.work_place,
    (this.emergency_contact?.length ?? 0) > 0,
    !!this.blood_type,
    !!this.rh_factor,
    !!this.chronic_diseases,
    (this.medicine?.length ?? 0) > 0,
    (this.allergies?.length ?? 0) > 0,
    (this.implants?.length ?? 0) > 0,
    !!this.note_about,
  ];

  const filled = checks.filter(Boolean).length;
  return Math.max(1, Math.round((filled / checks.length) * 100));
});
