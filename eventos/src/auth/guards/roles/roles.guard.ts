import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../decorators/public/public.decorator';
import { ROLES_KEY } from '../../decorators/roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    //const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[context.getHandler(), context.getClass()],    );

    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    

    this.logger.log(`📋 Roles requeridos: ${requiredRoles}`);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.logger.log(`👤 Usuario en request: ${JSON.stringify(user)}`);

    if (!user || !user.roles) {
      this.logger.warn('❌ Usuario sin roles o no autenticado');
      return false;
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    this.logger.log(`✅ ¿Tiene el rol? ${hasRole}`);
    return hasRole;
  }
}
