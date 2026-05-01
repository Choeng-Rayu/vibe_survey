export class RBACService {
  private roles = ['survey_taker', 'advertiser', 'admin'];
  private permissions: Record<string, string[]> = {
    survey_taker: [
      'view_own_surveys',
      'take_surveys',
      'view_profile',
      'view_wallet'
    ],
    advertiser: [
      'create_surveys',
      'view_own_surveys',
      'view_analytics',
      'manage_campaigns',
      'view_templates'
    ],
    admin: [
      'manage_users',
      'manage_surveys',
      'manage_campaigns',
      'view_analytics',
      'manage_content',
      'moderate',
      'view_system_config',
      'manage_withdrawals',
      'view_audit_logs'
    ]
  };

  hasPermission(userRole: string, permission: string): boolean {
    // Admins have all permissions
    if (userRole === 'admin') {
      return true;
    }
    
    // Check if the role exists and has the permission
    if (this.permissions[userRole] && this.permissions[userRole].includes(permission)) {
      return true;
    }
    
    return false;
  }

  getPermissionsForRole(role: string): string[] {
    return this.permissions[role] || [];
  }

  getAllPermissions(): Record<string, string[]> {
    return this.permissions;
  }

  getRoles(): string[] {
    return this.roles;
  }
}

export const rbacService = new RBACService();