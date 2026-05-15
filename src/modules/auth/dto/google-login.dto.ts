import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'googleToken is required' })
  googleToken: string;

  @IsDateString({}, { message: 'birth_date must be a valid ISO date string' })
  @IsNotEmpty({ message: 'birth_date is required' })
  birth_date: string;

  @IsString()
  @IsNotEmpty({ message: 'country is required' })
  country: string;
}
