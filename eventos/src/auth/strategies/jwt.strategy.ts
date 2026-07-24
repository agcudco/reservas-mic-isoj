import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const secretBase64 = configService.get<string>('JWT_SECRET');
    if (!secretBase64) {
      throw new Error('JWT_SECRET no está definida en variables de entorno');
    }

    // Decodificar la clave Base64 a un Buffer (igual que Spring Boot)
    const secret = Buffer.from(secretBase64, 'base64');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.log(`🔍 Payload recibido: ${JSON.stringify(payload)}`);
    if (!payload.roles) {
      this.logger.warn('⚠️ Payload sin roles, asignando array vacío');
      payload.roles = [];
    }
    const user = await this.authService.validateUser(payload);
    this.logger.log(`✅ Usuario validado: ${JSON.stringify(user)}`);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
