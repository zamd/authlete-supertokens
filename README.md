# Authlete-Supertokens Integration Sample

This repository demonstrates how to integrate Authlete, an "Identity Component as a Service," with Supertokens, acting as an "Authentication Component." Authlete serves as the OAuth/OIDC compliant token issuer in this scenario.

## Introduction

The sample project showcases the integration of Authlete with Supertokens using the Authlete Node SDK. The SDK facilitates easy integration into the Node.js Express framework.

![image](https://github.com/zamd/authlete-supertokens/assets/1377205/1e7382a7-9731-481d-b071-8c34d67e1d93)


### Prerequisites

Before running the sample, ensure you have the following installed:

- Node.js
- Authlete Node SDK (Currently embedded in the sample)

## Getting Started

To set up the project, follow these steps:

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
4. Extend the Supertokens project to use the Authlete Node SDK.
5. Integrate the SDK into the Node.js Express framework as follows:

```typescript
import { createDefaultBackend, useSuperTokenAuthentication } from "./lib";

// Configure authentication handler
const authenticationHandler = useSuperTokenAuthentication(getWebsiteDomain());

// Create default backend with authentication handler
const defaultBackend = createDefaultBackend(authenticationHandler);

// Mount backend on the app
app.use(defaultBackend);

```

## Important Note

Authlete requires the `redirect_uri` to use HTTPS. Even localhost without HTTPS is not allowed. Therefore, to run the Authlete sample, we need to set up a reverse proxy like Caddy.

### Installation Instructions for Caddy:

#### macOS (Homebrew)

```bash
brew install caddy
```

### Running Caddy with Proxy Configuration:

Ensure that you have a `Caddyfile` configured properly in the same directory where you'll run Caddy.

#### Command to Run Caddy:

```bash
caddy run
```

This setup will proxy `https://localhost` to the backend server, allowing the Authlete sample to run with the required HTTPS redirect URI.
```
