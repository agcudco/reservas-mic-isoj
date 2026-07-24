import { Injectable } from '@nestjs/common';

export interface JwtPayload {
  sub: string; // userId (UUID)
  username: string;
  version: number;
  roles: string[];
}

@Injectable()
export class AuthService {
  // Validación simple: extrae datos del payload
  async validateUser(payload: JwtPayload) {
    // Aquí podrías hacer una llamada a Spring Boot para verificar tokenVersion o roles actualizados
    // Por ahora devolvemos el payload directamente
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles || [],
      tokenVersion: payload.version,
    };
  }
}
