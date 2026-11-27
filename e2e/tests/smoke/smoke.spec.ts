import { request as httpsRequest } from "node:https";
import { test, expect } from "@playwright/test";

// In-cluster defaults — the Istio ingressgateway service DNS name.
// For local dev, override via env vars:
//   SMOKE_GW_HTTP=http://localhost:9080
//   SMOKE_GW_HTTPS=https://localhost
const GW_HTTP =
  process.env.SMOKE_GW_HTTP ??
  "http://istio-ingressgateway.istio-system.svc.cluster.local";
const GW_HTTPS =
  process.env.SMOKE_GW_HTTPS ??
  "https://istio-ingressgateway.istio-system.svc.cluster.local";

const endpoints = [
  { gw: GW_HTTP,  host: "kiali.local",      path: "/" },
  { gw: GW_HTTP,  host: "grafana.local",     path: "/login" },
  { gw: GW_HTTP,  host: "jaeger.local",      path: "/" },
  { gw: GW_HTTP,  host: "prometheus.local",  path: "/-/healthy" },
  { gw: GW_HTTP,  host: "rabbit.local",      path: "/" },
  { gw: GW_HTTP,  host: "mail.local",        path: "/" },
  { gw: GW_HTTPS, host: "keycloak.local",    path: "/realms/master/.well-known/openid-configuration" },
  { gw: GW_HTTPS, host: "argocd.local",      path: "/" },
  { gw: GW_HTTPS, host: "osaan.local",       path: "/" },
  { gw: GW_HTTPS, host: "osaan.admin.local", path: "/" },
];

// The Istio gateway picks a TLS server by SNI, so an HTTPS request must
// present the virtual host as its server name, not the gateway's address.
// Playwright's request context cannot set SNI apart from the URL.
function httpsStatus(gw: string, host: string, path: string): Promise<number> {
  const url = new URL(gw);
  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      {
        hostname: url.hostname,
        port: url.port || 443,
        path,
        method: "GET",
        servername: host,
        headers: { Host: host },
        rejectUnauthorized: false,
        timeout: 15_000,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      }
    );
    req.on("timeout", () => req.destroy(new Error(`${host}${path} timed out`)));
    req.on("error", reject);
    req.end();
  });
}

for (const { gw, host, path } of endpoints) {
  test(`${host} responds`, async ({ request }) => {
    const status = gw.startsWith("https:")
      ? await httpsStatus(gw, host, path)
      : (
          await request.get(`${gw}${path}`, {
            headers: { Host: host },
            failOnStatusCode: false,
          })
        ).status();
    expect(status, `${host}${path} returned ${status}`).toBeLessThan(500);
  });
}
