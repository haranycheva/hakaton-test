import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../../schemas/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

  async register(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const { email, password, first_name, last_name, birth_date, country } =
      createUserDto;

    const doesExist = await this.userModel.findOne({ email }).exec();
    if (doesExist) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = '';

    if (file) {
      const uploadResponse = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResponse.secure_url;
    }

    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      birth_date,
      country,
      avatar: imageUrl,
    });
    if (!newUser) {
      throw new InternalServerErrorException('Failed to create user');
    }

    const token = this.generateToken(newUser);

    return {
      user: {
        _id: newUser._id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        avatar: newUser.avatar,
        birth_date: newUser.birth_date,
        country: newUser.country,
        phone: newUser.phone,
        passport_number: newUser.passport_number,
        home_address: newUser.home_address,
        work_place: newUser.work_place,
        emergency_contact: newUser.emergency_contact,
        blood_type: newUser.blood_type,
        rh_factor: newUser.rh_factor,
        chronic_diseases: newUser.chronic_diseases,
        medicine: newUser.medicine,
        allergies: newUser.allergies,
        implants: newUser.implants,
        animals: newUser.animals,
        note_about: newUser.note_about,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.password) {
      throw new UnauthorizedException('Please log in with Google');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.generateToken(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        birth_date: user.birth_date,
        country: user.country,
        phone: user.phone,
        passport_number: user.passport_number,
        home_address: user.home_address,
        work_place: user.work_place,
        emergency_contact: user.emergency_contact,
        blood_type: user.blood_type,
        rh_factor: user.rh_factor,
        chronic_diseases: user.chronic_diseases,
        medicine: user.medicine,
        allergies: user.allergies,
        implants: user.implants,
        animals: user.animals,
        note_about: user.note_about,
      },
      token,
    };
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .select('-password')
      .exec();

    return { user: updatedUser };
  }

  async updateAvatar(id: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploadResponse = await this.cloudinaryService.uploadImage(file);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { avatar: uploadResponse.secure_url } },
        { new: true },
      )
      .select('-password')
      .exec();

    return { user: updatedUser };
  }

  async googleLogin(googleLoginDto: GoogleLoginDto) {
    const { googleToken, birth_date, country } = googleLoginDto;
    try {
      if (!googleToken) {
        throw new BadRequestException('Google access token is required');
      }
      const res = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleToken}`,
          },
        },
      );

      const payload = res.data;

      if (!payload || !payload.email) {
        throw new BadRequestException('Invalid Google access token');
      }
      const { email, name, picture } = payload;

      let user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        const nameParts = (name as string)?.split(' ') ?? [];
        if (!birth_date) {
          throw new BadRequestException('Birth date is required');
        }
        if (!country) {
          throw new BadRequestException('Country is required');
        }
        user = await this.userModel.create({
          email,
          first_name: nameParts[0] ?? email.split('@')[0],
          last_name: nameParts.slice(1).join(' ') || '',
          avatar: picture,
          birth_date: new Date(birth_date),
          country,
        });
      }

      const token = this.generateToken(user);

      return {
        user: {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar,
          birth_date: user.birth_date,
          country: user.country,
          phone: user.phone,
          passport_number: user.passport_number,
          home_address: user.home_address,
          work_place: user.work_place,
          emergency_contact: user.emergency_contact,
          blood_type: user.blood_type,
          rh_factor: user.rh_factor,
        },
        token,
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new BadRequestException('Invalid or expired Google token');
      }

      throw new InternalServerErrorException(
        error?.message || 'Google login failed',
      );
    }
  }
}
