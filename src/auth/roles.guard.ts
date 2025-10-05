import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    let user;
    if (context.getType() === 'http') {
      user = context.switchToHttp().getRequest().user;
    } else {
      const ctx = GqlExecutionContext.create(context);
      user = ctx.getContext().req.user;
    }

    return roles.includes(user.role);
  }
}