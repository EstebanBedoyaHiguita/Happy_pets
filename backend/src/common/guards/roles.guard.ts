import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { UserRole } from '../../users/schemas/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    type RequestWithUser = Request & { user?: { role?: UserRole } };
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    if (!user || typeof user.role === 'undefined') return false;

    return requiredRoles.some((role) => user.role === role);
  }
}
