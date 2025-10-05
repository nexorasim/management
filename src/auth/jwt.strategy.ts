import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'nexora-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.findById(payload.sub);
    return { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      carrier: user.carrier 
    };
  }
}