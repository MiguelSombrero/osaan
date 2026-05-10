import { test, expect } from "@playwright/test";

// In-cluster defaults — the Istio ingressgateway service DNS name.
// For local dev, override via env vars:
//   SMOKE_GW_HTTP=http://localhost:9080
//   SMOKE_GW_HTTPS=https://localhost:9443
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

for (const { gw, host, path } of endpoints) {
  test(`${host} responds`, async ({ request }) => {
    const res = await request.get(`${gw}${path}`, {
      headers: { Host: host },
      failOnStatusCode: false,
    });
    expect(
      res.status(),
      `${host}${path} returned ${res.status()}`
    ).toBeLessThan(500);
  });
}
