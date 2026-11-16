export const DEFAULT_BASE_PATH = '/workspace';

export const NATIVE_MENUS = [
  { key: 'overview', label: 'Workspace Overview', icon: 'layout', path: '/overview' },
  { key: 'reports', label: 'Reports', icon: 'bar-chart', path: '/reports' },
];

export const CHILD_MENUS = [
  {
    id: 'customer-management',
    label: 'Customer Management',
    icon: 'team',
    remoteId: 'mfe-b',
    host: 'http://localhost:5003',
    pathname: '/customers/overview',
  },
];

export const CHILD_ROUTE_PREFIX = '/customers';