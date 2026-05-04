import Link from 'next/link';
import { useRBAC } from '@/contexts/RBACContext';

export const Sidebar = () => {
  const { role, hasPermission } = useRBAC();

  const navigation = [
    { href: '/', label: 'Dashboard', permission: 'view_analytics' },
    { href: '/campaigns', label: 'Campaign Review', permission: 'manage_campaigns' },
    { href: '/moderation', label: 'Content Moderation', permission: 'moderate' },
    // Add additional navigation items as needed
  ];

  return (
    <nav className="h-full w-64 bg-surface p-4">
      <ul className="space-y-2">
        {navigation
          .filter((item) => (item.permission ? hasPermission(item.permission) : true))
          .map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-md p-2 hover:bg-surface-hover"
              >
                {item.label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};
