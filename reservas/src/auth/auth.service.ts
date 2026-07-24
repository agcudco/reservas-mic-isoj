import { Injectable } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
  username: string;
  version: number;
  roles: string[];
}

@Injectable()
export class AuthService {
  async validateUser(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles || [],
      tokenVersion: payload.version,
    };
  }
}
