import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'first_name must be a string' })
  @IsNotEmpty({ message: 'first_name is required' })
  first_name: string;

  @IsString({ message: 'last_name must be a string' })
  @IsNotEmpty({ message: 'last_name is required' })
  last_name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsDateString({}, { message: 'birth_date must be a valid ISO date string' })
  @IsNotEmpty({ message: 'birth_date is required' })
  birth_date: string;

  @IsString({ message: 'country must be a string' })
  @IsNotEmpty({ message: 'country is required' })
  country: string;
}
