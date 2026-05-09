import {
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
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

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

  async register(createUserDto: CreateUserDto, filePath: string) {
    const { email, password, user_name, public_name } = createUserDto;

    const doesExist = await this.userModel.findOne({ email, user_name }).exec();
    if (doesExist) {
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";

    if (filePath) {
      const uploadResponse = await this.cloudinaryService.uploadImage(filePath);
      imageUrl = uploadResponse.secure_url; 
    }

    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      user_name,
      public_name,
      avatar: imageUrl,
    });
    if (!newUser) {
      throw new InternalServerErrorException('Failed to create user');
    }

    const access_token = this.generateToken(newUser);

    return {
      user: {
        _id: newUser._id,
        email: newUser.email,
        user_name: newUser.user_name,
        public_name: newUser.public_name,
        avatar: newUser.avatar,
      },
      token: access_token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const access_token = this.generateToken(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        user_name: user.user_name,
        public_name: user.public_name,
        avatar: user.avatar,
      },
      token: access_token,
    };
  }

  async getUser(id: string) {
    const user = await this.userModel
      .findById(id).select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      user: {
        _id: user._id,
        email: user.email,
        user_name: user.user_name,
        public_name: user.public_name,
        avatar: user.avatar,
      },
    };
  }
}
