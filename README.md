# Nested Microfrontend Integration Demo

An independent technical demonstration of a nested microfrontend architecture, built with three separately running React applications.

## Overview

This project shows how independently developed React applications can load, render, and manage one another at runtime, without being bundled together. Each application has its own codebase, dependencies, dev server, and build output.

The demo covers two integration paths:

- **Direct integration:** Parent Application → MFE A, and Parent Application → MFE B
- **Nested integration:** Parent Application → MFE A → MFE B

## Background

This project is based on a nested microfrontend integration scenario I previously worked on, where one application needed to embed another application, which in turn needed to embed a third one. The same remote application also needed to be accessible both directly from the main application and from within the intermediate application.

That experience raised several technical questions that this demo explores in a small, self-contained implementation:

- How can one application load another at runtime without static imports?
- How can each host manage only the remote instance it owns?
- How can the same remote application work in both direct and nested integrations without duplicating its pages?

This repository is an independent implementation built from scratch to demonstrate the architectural concepts. It uses fictional application names, routes, configurations, and mock data. It does not reproduce any previous implementation or contain proprietary code, data, or infrastructure.

## Goals

- Demonstrate runtime loading of applications through the Create React App `asset-manifest.json`, without static imports and without Module Federation.
- Keep clear application boundaries: each host manages only the remote instance it mounts itself.
- Let one remote application (MFE B) serve both a direct host and a nested host through the same bundle, route configuration, and lifecycle API, without duplicated page implementations.
- Use explicit lifecycle APIs based on `ReactDOM.render()` and `ReactDOM.unmountComponentAtNode()`.

## Architecture

```text
                 Parent Application
                   /            \
                  /              \
                 v                v
              MFE A              MFE B
                |
                | Nested Integration
                v
              MFE B
```

| Application | Role |
|---|---|
| **Parent Application** | Owns the global shell (header, sidebar), main routing, and the Dashboard. Hosts MFE A and MFE B directly. |
| **MFE A — Workspace** | Owns the Workspace layout and navigation, plus the Workspace Overview and Reports pages. Hosts MFE B as a nested remote. |
| **MFE B — Customer Module** | Provides Customer Overview and Customer Activity page content only. Does not render a global shell. |

A host is responsible only for the remote instance it mounts. Parent does not manage the MFE B instance nested inside MFE A, and MFE A does not manage the MFE B instance mounted by Parent.

## Technology Stack

- Node.js 16
- React 16.14.0 (JavaScript only)
- Create React App (`react-scripts` 5.0.1)
- React Router DOM v5
- Ant Design v3
- npm and CSS

Not used: React 18, Next.js, Vite, Module Federation, TypeScript, npm workspaces.

## Repository Structure

```text
nested-microfrontend-demo/
├── apps/
│   ├── parent-app/     # Main application and direct remote host
│   ├── mfe-a/          # Workspace application and nested remote host
│   └── mfe-b/          # Customer module (remote content provider)
├── packages/
│   └── shared/         # Reserved for genuinely shared, non-application-specific utilities
├── package.json        # Root scripts for orchestration only
└── README.md
```

## Application Ports

| Application | Port | URL |
|---|---:|---|
| Parent Application | 5001 | http://localhost:5001 |
| MFE A — Workspace | 5002 | http://localhost:5002 |
| MFE B — Customer Module | 5003 | http://localhost:5003 |

Ports are configured through each application's `.env` file.

## Prerequisites

- Node.js 16.x (an `.nvmrc` is provided: `nvm use`)
- npm 8.x (bundled with Node.js 16)
- Ports 5001, 5002, and 5003 available

## Getting Started

Install dependencies for the root and all three applications:

```bash
npm run install:all
```

Run everything together:

```bash
npm run dev
```

Or run each application on its own:

```bash
npm run dev:parent   # http://localhost:5001
npm run dev:mfe-a    # http://localhost:5002
npm run dev:mfe-b    # http://localhost:5003
```

Build all applications:

```bash
npm run build
```

## Disclaimer

- This is an independent technical demonstration.
- The architectural idea is inspired by a real-world case from my professional work environment; everything else in this repository is original and fictional.
- The project is independently implemented from scratch, and all source code is newly written.
- Application names, routes, configuration, and mock data are fictional.
- No proprietary company source code, private data, credentials, endpoints, assets, or internal infrastructure are included.
- This is not the original company implementation.
- This is not a production system unless it is independently developed and verified for that purpose.