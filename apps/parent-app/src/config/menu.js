export const MENU_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/', type: 'native' },
  { key: 'workspace', label: 'Workspace', icon: 'appstore', path: '/workspace', type: 'remote', remote: 'mfe-a' },
  { key: 'customers', label: 'Customer Management', icon: 'team', path: '/customers', type: 'remote', remote: 'mfe-b' },
];

export function findMenuKey(pathname) {
  const hit = MENU_ITEMS.find((m) =>
    m.path === '/' ? pathname === '/' : pathname === m.path || pathname.startsWith(m.path + '/')
  );
  return hit ? hit.key : null;
}