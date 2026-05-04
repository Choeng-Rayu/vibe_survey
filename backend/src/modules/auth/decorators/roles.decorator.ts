import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Requirement 3.3: RBAC roles decorator
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
