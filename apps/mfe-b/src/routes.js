import CustomerOverview from './pages/CustomerOverview';
import CustomerActivity from './pages/CustomerActivity';

export const DEFAULT_PATHNAME = '/customers/overview';

const ROUTES = [
  { id: 'customer-overview', label: 'Customer Overview', pathname: '/customers/overview', component: CustomerOverview },
  { id: 'customer-activity', label: 'Customer Activity', pathname: '/customers/activity', component: CustomerActivity },
];

// Serializable only: no React components leave this module.
export function getRouteMetadata() {
  return ROUTES.map(({ id, label, pathname }) => ({ id, label, pathname }));
}

function normalize(pathname) {
  const clean = String(pathname || '').split(/[?#]/)[0];
  return clean.length > 1 ? clean.replace(/\/+$/, '') : clean;
}

export function resolveRoute(pathname) {
  const target = normalize(pathname);
  return ROUTES.find((r) => r.pathname === target) || null;
}