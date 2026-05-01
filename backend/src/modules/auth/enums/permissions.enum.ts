// Requirement 3.3: Granular permissions for RBAC
export enum Permission {
  // Survey permissions
  SURVEY_CREATE = 'survey:create',
  SURVEY_READ = 'survey:read',
  SURVEY_UPDATE = 'survey:update',
  SURVEY_DELETE = 'survey:delete',
  
  // Campaign permissions
  CAMPAIGN_CREATE = 'campaign:create',
  CAMPAIGN_READ = 'campaign:read',
  CAMPAIGN_UPDATE = 'campaign:update',
  CAMPAIGN_DELETE = 'campaign:delete',
  CAMPAIGN_APPROVE = 'campaign:approve',
  
  // User permissions
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_MODERATE = 'user:moderate',
  
  // Admin permissions
  ADMIN_ACCESS = 'admin:access',
  ADMIN_MODERATE = 'admin:moderate',
  ADMIN_ANALYTICS = 'admin:analytics',
}
