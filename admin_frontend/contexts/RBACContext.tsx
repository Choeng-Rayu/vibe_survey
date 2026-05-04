import { createContext, useContext, ReactNode } from 'react';
import { rbacService } from '@/services/rbac.service';
import { useAuthContext } from '@/contexts/AuthContext';

type RBACContextType = {
  role: string | null;
  hasPermission: (permission: string) => boolean;
  getPermissions: () => string[];
};

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const role = user?.role ?? null;

  const hasPermission = (permission: string) => {
    if (!role) return false;
    return rbacService.hasPermission(role, permission);
  };

  const getPermissions = () => {
    if (!role) return [];
    return rbacService.getPermissionsForRole(role);
  };

  const value: RBACContextType = { role, hasPermission, getPermissions };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
