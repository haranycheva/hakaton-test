import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ItemCategory } from './enums/item-category.enum';
import { ItemStatus } from './enums/item-status.enum';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ timestamps: true, versionKey: false })
export class Item {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: ItemCategory, required: true })
  category: ItemCategory;

  @Prop({ type: Number, required: true, min: 0 })
  quantity: number;

  @Prop({ type: Boolean, default: false })
  isEssential: boolean;

  @Prop({ type: Number, default: null })
  weight: number | null;

  @Prop({ type: String, trim: true, default: null })
  unit: string | null;

  @Prop({ type: Date, default: null })
  expireDate: Date | null;

  @Prop({ type: Number, default: null })
  reminderThresholdDays: number | null;

  @Prop({ type: String, enum: ItemStatus, default: ItemStatus.PROPOSED })
  status: ItemStatus;

  @Prop({ type: String, trim: true, default: null })
  notes: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
