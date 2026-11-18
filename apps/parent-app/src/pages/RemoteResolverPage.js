import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Spin } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { REMOTE_MENUS } from "../remote/remoteConfig";
import { resolvePath } from "../remote/remoteRoutes";
import MicroFrontend from "../remote/Microfrontend";

const REQUIRED_API = ["getRoutes", "render", "unmount"];

export default function RemoteResolverPage() {
  const history = useHistory();
  const { pathname } = useLocation();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    resolvePath(pathname, REMOTE_MENUS).then((res) => {
      if (cancelled) return;
      if (res.status === "found" && res.redirectTo) {
        history.replace(res.redirectTo);
        return;
      }
      setResult({ ...res, pathname });
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, history, attempt]);

  const renderProps = useMemo(() => {
    if (!result || result.status !== "found") return null;
    return {
      history,
      pathname: result.pathname,
      basePath: result.route.prefix ? result.route.pathname : undefined,
      onNavigate: (p) => history.push(p),
    };
  }, [result, history]);

  if (!result) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin tip="Resolving page..." />
      </div>
    );
  }

  if (result.status === "not-found") {
    const description =
      result.reason === "NO_HOST"
        ? `No page or application is registered for "${result.pathname}".`
        : `${result.menu.label} does not provide the path "${result.pathname}".`;
    return <Alert type="warning" showIcon message="Page not found" description={description} />;
  }

  if (result.status === "error") {
    return (
      <Alert
        type="error"
        showIcon
        message={`Failed to load "${result.menu.label}"${result.error.code ? ` (${result.error.code})` : ""}`}
        description={
          <div>
            <div style={{ marginBottom: 8 }}>{result.error.message}</div>
            <Button
              size="small"
              onClick={() => {
                setResult(null);
                setAttempt((a) => a + 1);
              }}
            >
              Retry
            </Button>
          </div>
        }
      />
    );
  }

  const { menu } = result;
  return (
    <MicroFrontend
      key={menu.id}
      name={menu.id}
      remoteName={menu.remoteName}
      host={menu.host}
      requiredApi={REQUIRED_API}
      renderProps={renderProps}
    />
  );
}