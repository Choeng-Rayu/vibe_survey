import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Permission } from '../enums/permissions.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

// Requirement 3.3: Permission-based authorization guard
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();
    const userPermissions = this.getRolePermissions(user.role);

    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }

  private getRolePermissions(role: Role): Permission[] {
    const permissionMap: Record<Role, Permission[]> = {
      [Role.survey_taker]: [Permission.SURVEY_READ, Permission.USER_READ, Permission.USER_UPDATE],
      [Role.advertiser]: [
        Permission.SURVEY_CREATE,
        Permission.SURVEY_READ,
        Permission.SURVEY_UPDATE,
        Permission.SURVEY_DELETE,
        Permission.CAMPAIGN_CREATE,
        Permission.CAMPAIGN_READ,
        Permission.CAMPAIGN_UPDATE,
        Permission.CAMPAIGN_DELETE,
        Permission.USER_READ,
        Permission.USER_UPDATE,
      ],
      [Role.admin]: Object.values(Permission),
    };
    return permissionMap[role] || [];
  }
}
