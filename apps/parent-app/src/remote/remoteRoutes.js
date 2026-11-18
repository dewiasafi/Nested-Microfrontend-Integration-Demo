import { loadRemote, RemoteLoadError } from "./remoteLoader";

const REQUIRED_API = ["getRoutes", "render", "unmount"];

const routesCache = new Map();

function normalize(pathname) {
  const clean = String(pathname || "").split(/[?#]/)[0];
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
}

function validateRoutes(menu, routes) {
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new RemoteLoadError("MISSING_ROUTES", `"${menu.remoteName}" returned no route metadata.`);
  }
  routes.forEach((r) => {
    const ok = r && typeof r.id === "string" && typeof r.pathname === "string" && r.pathname.startsWith("/");
    if (!ok) {
      throw new RemoteLoadError("INVALID_ROUTES", `"${menu.remoteName}" returned an invalid route entry.`);
    }
  });
  return routes;
}

export function findMenuForPath(pathname, menus) {
  const path = normalize(pathname);
  let best = null;
  menus.forEach((m) => {
    if (!m.host) return;
    const base = normalize(m.pathname);
    if (base === "/") return;
    const hit = path === base || path.startsWith(base + "/");
    if (hit && (!best || base.length > normalize(best.pathname).length)) best = m;
  });
  return best;
}

function getRemoteRoutes(menu) {
  const key = `${menu.remoteName}@${menu.host}`;
  if (!routesCache.has(key)) {
    const promise = loadRemote({ name: menu.remoteName, host: menu.host, requiredApi: REQUIRED_API })
      .then((api) => validateRoutes(menu, api.getRoutes()))
      .catch((err) => {
        routesCache.delete(key);
        throw err;
      });
    routesCache.set(key, promise);
  }
  return routesCache.get(key);
}

function matchRoutes(routes, path) {
  for (const r of routes) {
    const p = normalize(r.pathname);
    const hit = r.prefix ? path === p || path.startsWith(p + "/") : path === p;
    if (hit) return { route: r };
  }

  const child = routes.find((r) => !r.prefix && normalize(r.pathname).startsWith(path + "/"));
  if (child) return { route: child, redirectTo: child.pathname };
  return null;
}


export async function resolvePath(pathname, menus) {
  const path = normalize(pathname);

  const menu = findMenuForPath(path, menus);
  if (!menu) return { status: "not-found", reason: "NO_HOST", menu: null };

  let routes;
  try {
    routes = await getRemoteRoutes(menu);
  } catch (error) {
    return { status: "error", menu, error };
  }

  const match = matchRoutes(routes, path);
  if (!match) return { status: "not-found", reason: "NO_ROUTE", menu };

  return { status: "found", menu, route: match.route, redirectTo: match.redirectTo || null };
}