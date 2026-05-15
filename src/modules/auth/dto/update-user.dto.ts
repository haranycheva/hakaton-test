import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BloodType } from '../../../schemas/enums/blood-type.enum';
import { RhFactor } from '../../../schemas/enums/rh-factor.enum';

class PersonContactDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  passport_number?: string;

  @IsOptional()
  @IsString()
  home_address?: string;

  @IsOptional()
  @IsString()
  work_place?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonContactDto)
  emergency_contact?: PersonContactDto[];

  @IsOptional()
  @IsEnum(BloodType)
  blood_type?: BloodType;

  @IsOptional()
  @IsEnum(RhFactor)
  rh_factor?: RhFactor;

  @IsOptional()
  @IsString()
  chronic_diseases?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicine?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  implants?: string[];

  @IsOptional()
  @IsString()
  note_about?: string;
}
