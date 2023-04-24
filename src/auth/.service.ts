import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './.dto';
import { UserService } from '../User/.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOne(signInDto.email);
    if (signInDto.password !== user.password) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
