import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; // Corrected bcrypt import
import { SignInRequestDTO, SignUpRequestDTO } from 'src/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthResponse } from 'src/response/auth.response';
import { ValidationService } from 'src/validation/validation.service';
import { AuthValidation } from './auth.validation';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
    private jwtService: JwtService,
  ) {}

  async signUp(request: SignUpRequestDTO): Promise<AuthResponse> {
    const signUpRequest: SignUpRequestDTO = this.validation.validate(
      AuthValidation.SignUp,
      request,
    );

    const isUserExists = await this.prisma.user.findFirst({
      where: { email: signUpRequest.email },
    });

    if (isUserExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(signUpRequest.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: signUpRequest.email,
        name: signUpRequest.name,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async signIn(request: SignInRequestDTO): Promise<AuthResponse> {
    const signInRequest: SignInRequestDTO = this.validation.validate(
      AuthValidation.SignIn,
      request,
    );

    const user = await this.prisma.user.findFirst({
      where: { email: signInRequest.email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(
      signInRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, email: user.email, name: user.name };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      access_token: accessToken,
    };
  }
}
