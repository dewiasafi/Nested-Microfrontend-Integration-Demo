import React from "react";
import { Alert, Button, Spin } from "antd";
import { loadRemote, RemoteLoadError } from "./remoteLoader";

let instanceCounter = 0;

class Microfrontend extends React.Component {
  state = { status: "loading", error: null };

  containerId = `mfe-${this.props.name}-${++instanceCounter}`;
  api = null;
  remoteMounted = false; 
  runId = 0; 

  componentDidMount() {
    this.start();
  }

  componentDidUpdate(prevProps) {
    const { remoteName, host, renderProps } = this.props;
    if (prevProps.remoteName !== remoteName || prevProps.host !== host) {
      this.teardown();
      this.start();
    } else if (prevProps.renderProps !== renderProps && this.api) {
      this.safeRender();
    }
  }

  componentWillUnmount() {
    this.teardown();
  }

  isCurrent(runId) {
    return runId === this.runId;
  }

  callRender() {
    const { beforeRender, renderProps, remoteName } = this.props;
    if (beforeRender && beforeRender(this.api) === false) return false;
    try {
      this.api.render(this.containerId, renderProps || {});
    } catch (e) {
      throw new RemoteLoadError(
        "RENDER_FAILED",
        `Remote "${remoteName}" failed to render: ${e.message}`,
        e
      );
    }
    this.remoteMounted = true;
    return true;
  }

  safeRender() {
    try {
      this.callRender();
      if (this.state.status !== "ready") this.setState({ status: "ready", error: null });
    } catch (err) {
      this.unmountTree();
      this.setState({ status: "error", error: err });
    }
  }

  async start() {
    const runId = ++this.runId;
    const { remoteName, host, requiredApi } = this.props;
    this.setState({ status: "loading", error: null });
    try {
      const api = await loadRemote({ name: remoteName, host, requiredApi });
      if (!this.isCurrent(runId)) return; 
      this.api = api;
      this.callRender();
      this.setState({ status: "ready", error: null });
    } catch (err) {
      if (!this.isCurrent(runId)) return;
      this.unmountTree();
      this.setState({ status: "error", error: err });
    }
  }

  unmountTree() {
    if (this.remoteMounted && this.api) {
      try {
        this.api.unmount(this.containerId);
      } catch (e) {
        console.error(`[Microfrontend] unmount failed for ${this.containerId}`, e);
      }
    }
    this.remoteMounted = false;
  }

  teardown() {
    this.runId++;
    this.unmountTree();
    this.api = null;
  }

  retry = () => {
    this.teardown();
    this.start();
  };

  render() {
    const { status, error } = this.state;
    return (
      <div className="mfe-host">
        {status === "loading" && (
          <div style={{ padding: 48, textAlign: "center" }}>
            <Spin tip="Loading remote application..." />
          </div>
        )}
        {status === "error" && (
          <Alert
            type="error"
            showIcon
            message={`Failed to load "${this.props.remoteName}"${error && error.code ? ` (${error.code})` : ""}`}
            description={
              <div>
                <div style={{ marginBottom: 8 }}>{error ? error.message : "Unknown error"}</div>
                <Button size="small" onClick={this.retry}>
                  Retry
                </Button>
              </div>
            }
          />
        )}
        <div id={this.containerId} />
      </div>
    );
  }
}

export default Microfrontend;