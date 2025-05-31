import { HttpException, Injectable } from '@nestjs/common';
import { UpdateProfileRequestDTO, UserRequestDTO } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from 'src/response/user.response';
import { ValidationService } from 'src/validation/validation.service';
import { UserValidation } from 'src/user/user.validation';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
  ) {}

  async getProfile(user: UserRequestDTO): Promise<UserResponse> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!foundUser) {
      throw new HttpException('User not found', 404);
    }

    return {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
    };
  }

  async updateProfile(
    user: UserRequestDTO,
    request: UpdateProfileRequestDTO,
  ): Promise<UserResponse> {
    const updateProfileRequest = this.validation.validate(
      UserValidation.UpdateProfile,
      request,
    );

    const foundUser = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!foundUser) {
      throw new HttpException('User not found', 404);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: updateProfileRequest.name,
      },
      select: {
        name: true,
      },
    });

    return {
      name: updatedUser.name,
    };
  }
}
