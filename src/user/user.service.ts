import { HttpException, Injectable } from '@nestjs/common';
import { GetProfileRequestDTO } from 'src/dto/user.dto';
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

  async getProfile(userId: string): Promise<UserResponse> {
    const getProfileRequest: GetProfileRequestDTO = this.validation.validate(
      UserValidation.GetProfile,
      { userId },
    );

    const user = await this.prisma.user.findFirst({
      where: { id: getProfileRequest.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
