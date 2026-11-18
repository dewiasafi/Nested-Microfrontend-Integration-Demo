const NAMESPACE = "NestedMfeDemo";

export class RemoteLoadError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = "RemoteLoadError";
    this.code = code;
    this.cause = cause;
  }
}

const manifestCache = new Map();
const assetCache = new Map();

function normalizeHost(host) {
  if (!host || typeof host !== "string") {
    throw new RemoteLoadError("MISSING_HOST", "Remote host is not configured.");
  }
  try {
    return new URL(host).origin;
  } catch (e) {
    throw new RemoteLoadError("INVALID_HOST", `Invalid remote host: "${host}"`, e);
  }
}

function resolveAssetUrl(path, origin) {
  const url = new URL(path, origin + "/");
  if (url.origin !== origin) {
    throw new RemoteLoadError(
      "ASSET_ORIGIN_MISMATCH",
      `Asset "${path}" resolves to ${url.origin}, expected ${origin}.`
    );
  }
  return url.href;
}

function parseManifest(manifest, origin) {
  if (!manifest || typeof manifest !== "object") {
    throw new RemoteLoadError("MANIFEST_INVALID", "Manifest is not a JSON object.");
  }

  let paths = Array.isArray(manifest.entrypoints) ? manifest.entrypoints : [];

  if (paths.length === 0 && manifest.files && typeof manifest.files === "object") {
    paths = ["main.css", "main.js"]
      .map((key) => manifest.files[key])
      .filter(Boolean);
  }
    paths = paths.filter((p) => typeof p === "string" && !p.includes(".hot-update."));  if (paths.length === 0) {
    throw new RemoteLoadError("MANIFEST_INVALID", "Manifest has no usable entrypoints or files.");
  }

  const urls = paths.map((p) => resolveAssetUrl(p, origin));
  const js = urls.filter((u) => new URL(u).pathname.endsWith(".js"));
  const css = urls.filter((u) => new URL(u).pathname.endsWith(".css"));

  if (js.length === 0) {
    throw new RemoteLoadError("MANIFEST_NO_JS", "Manifest does not contain any JavaScript asset.");
  }
  return { origin, js, css };
}

async function fetchManifest(origin) {
  const manifestUrl = `${origin}/asset-manifest.json`;
  let res;
  try {
    res = await fetch(manifestUrl, { cache: "no-cache", mode: "cors" });
  } catch (e) {
    throw new RemoteLoadError(
      "MANIFEST_FETCH_FAILED",
      `Cannot reach ${manifestUrl}. Is the remote application running?`,
      e
    );
  }
  if (!res.ok) {
    throw new RemoteLoadError(
      "MANIFEST_FETCH_FAILED",
      `Manifest request failed with HTTP ${res.status} (${manifestUrl}).`
    );
  }
  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new RemoteLoadError("MANIFEST_INVALID", `Manifest at ${manifestUrl} is not valid JSON.`, e);
  }
  return parseManifest(json, origin);
}

function cached(map, key, factory) {
  if (!map.has(key)) {
    const promise = factory().catch((err) => {
      map.delete(key);
      throw err;
    });
    map.set(key, promise);
  }
  return map.get(key);
}

export async function loadManifest(host) {
  const origin = normalizeHost(host);
  return cached(manifestCache, `${origin}/asset-manifest.json`, () => fetchManifest(origin));
}

function loadScript(url) {
  return cached(
    assetCache,
    url,
    () =>
      new Promise((resolve, reject) => {
        const el = document.createElement("script");
        el.src = url;
        el.async = false; 
        el.dataset.remoteAsset = "js";
        el.onload = () => resolve();
        el.onerror = () => {
          el.remove();
          reject(new RemoteLoadError("JS_LOAD_FAILED", `Failed to load script: ${url}`));
        };
        document.head.appendChild(el);
      })
  );
}

function loadStylesheet(url) {
  return cached(
    assetCache,
    url,
    () =>
      new Promise((resolve, reject) => {
        const el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = url;
        el.dataset.remoteAsset = "css";
        el.onload = () => resolve();
        el.onerror = () => {
          el.remove();
          reject(new RemoteLoadError("CSS_LOAD_FAILED", `Failed to load stylesheet: ${url}`));
        };
        document.head.appendChild(el);
      })
  );
}

export function getRemoteApi(name, requiredApi = ["render", "unmount"]) {
  const ns = window[NAMESPACE];
  if (!ns) {
    throw new RemoteLoadError("MISSING_NAMESPACE", `Global namespace "${NAMESPACE}" is not defined.`);
  }
  const api = ns[name];
  if (!api) {
    throw new RemoteLoadError("MISSING_REMOTE", `Remote "${name}" is not registered in ${NAMESPACE}.`);
  }
  requiredApi.forEach((fn) => {
    if (typeof api[fn] !== "function") {
      throw new RemoteLoadError("MISSING_API_FUNCTION", `Remote "${name}" does not expose ${fn}().`);
    }
  });
  return api;
}

export async function loadRemote({ name, host, requiredApi }) {
  const manifest = await loadManifest(host);
  await Promise.all(manifest.css.map(loadStylesheet));
  for (const url of manifest.js) {
    await loadScript(url);
  }
  return getRemoteApi(name, requiredApi);
}

export function getLoaderState() {
  return {
    manifests: Array.from(manifestCache.keys()),
    assets: Array.from(assetCache.keys()),
  };
}


