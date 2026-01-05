import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // payload contains the signed fields (fullname, email, sub)
  async validate(payload: any) {
    // try to return full user from database, fall back to payload
    const user = await this.usersService.getUserById(payload.sub);
    if (user) return user;
    return {
      id: payload.sub,
      email: payload.email,
      fullname: payload.fullname,
    };
  }
}
