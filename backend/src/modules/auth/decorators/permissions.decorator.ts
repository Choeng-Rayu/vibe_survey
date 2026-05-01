import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permissions.enum';

// Requirement 3.3: Permissions decorator for granular access control
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);
