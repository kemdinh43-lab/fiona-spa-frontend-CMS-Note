import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getFallbackContent } from "../server/googleSheetContent.js";
import {
  buildSeoPageModel,
  normalizeRequestPath,
  renderSeoHead
} from "../server/pageSeo.js";
import { buildRobotsTxt, buildSitemapXml } from "../server/seo.js";

const productionHost = "fionaspadanang.com";

test("English production pages are indexable with a production canonical", () => {
  const page = buildSeoPageModel(getFallbackContent(), "/en/services", productionHost);
  assert.equal(page.status, 200);
  assert.equal(page.robots, "index, follow, max-image-preview:large");
  assert.equal(page.canonicalUrl, "https://fionaspadanang.com/en/services");
  assert.match(page.snapshotHtml, /<h1>Massage, beauty and care menu<\/h1>/u);
});

test("the loading shell hides the SEO snapshot only when JavaScript is enabled", () => {
  const document = readFileSync("index.html", "utf8");
  const cloudflarePageHandler = readFileSync("functions/[[path]].ts", "utf8");

  assert.match(document, /document\.documentElement\.classList\.add\("js"\)/u);
  assert.match(document, /\[data-app-loading-shell\]\s*\{\s*display: none;/u);
  assert.match(document, /html\.js \[data-app-loading-shell\]\s*\{\s*display: block;/u);
  assert.match(document, /html\.js \[data-seo-snapshot\]\s*\{\s*display: none !important;/u);
  assert.match(document, /<div data-app-loading-shell/u);
  assert.match(cloudflarePageHandler, /element\.append\(model\.snapshotHtml/u);
  assert.doesNotMatch(cloudflarePageHandler, /setInnerContent\(model\.snapshotHtml/u);
});

test("home business schema uses the owner-confirmed NAP and opening hours", () => {
  const page = buildSeoPageModel(getFallbackContent(), "/en", productionHost);
  const head = renderSeoHead(page);
  assert.match(head, /"name":"Fiona Massage & Spa"/u);
  assert.match(head, /property="og:site_name" content="Fiona Massage &amp; Spa"/u);
  assert.doesNotMatch(head, /Fiona Beauty/u);
  assert.match(head, /"telephone":"\+84 941333184"/u);
  assert.match(head, /"streetAddress":"41 Ly Van To St"/u);
  assert.match(head, /"addressLocality":"An Hai ward, Da Nang"/u);
  assert.match(head, /"opens":"09:00"/u);
  assert.match(head, /"closes":"23:30"/u);
});

test("contact is an indexable local landing page included in the sitemap", async () => {
  const content = getFallbackContent();
  const page = buildSeoPageModel(content, "/en/contact", productionHost);
  assert.equal(page.status, 200);
  assert.equal(page.canonicalUrl, "https://fionaspadanang.com/en/contact");
  assert.match(page.title, /Contact Fiona Massage & Spa in Da Nang/u);
  assert.match(page.snapshotHtml, /<h1>Contact Fiona Massage &amp; Spa in Da Nang<\/h1>/u);
  const sitemap = await buildSitemapXml(
    { VITE_SITE_URL: "https://fionaspadanang.com", VITE_INDEX_ALL_LOCALES: "false" },
    "https://fionaspadanang.com/sitemap.xml"
  );
  assert.match(sitemap, /<loc>https:\/\/fionaspadanang\.com\/en\/contact<\/loc>/u);
});

test("the renamed Sport Massage page keeps permanent redirects on both hosts", () => {
  const cloudflareRedirects = readFileSync("public/_redirects", "utf8");
  assert.match(
    cloudflareRedirects,
    /^\/en\/services\/physical-therapy \/en\/services\/sport-massage 301$/mu
  );
  assert.match(
    cloudflareRedirects,
    /^\/services\/physical-therapy \/en\/services\/sport-massage 301$/mu
  );

  const vercelConfig = JSON.parse(readFileSync("vercel.json", "utf8")) as {
    redirects: Array<{ source: string; destination: string; permanent: boolean }>;
  };
  for (const source of ["/en/services/physical-therapy", "/services/physical-therapy"]) {
    assert.deepEqual(
      vercelConfig.redirects.find((redirect) => redirect.source === source),
      { source, destination: "/en/services/sport-massage", permanent: true }
    );
  }
});

test("non-English locales and preview hosts are noindex", () => {
  const content = getFallbackContent();
  assert.equal(buildSeoPageModel(content, "/vi/services", productionHost).robots, "noindex, follow");
  assert.equal(
    buildSeoPageModel(content, "/en/services", "preview.fiona-spa.pages.dev").robots,
    "noindex, follow"
  );
});

test("unknown static and dynamic routes return a noindex 404", () => {
  const content = getFallbackContent();
  for (const path of ["/en/not-a-page", "/en/services/not-a-service", "/en/blog/not-a-post"]) {
    const page = buildSeoPageModel(content, path, productionHost);
    assert.equal(page.status, 404);
    assert.equal(page.robots, "noindex, follow");
    assert.equal(page.jsonLd, undefined);
  }
});

test("service pages include distinct metadata and Service schema in the response head", () => {
  const content = getFallbackContent();
  const service = content.spaServices[0];
  const page = buildSeoPageModel(content, `/en/services/${service.slug}`, productionHost);
  const head = renderSeoHead(page);
  assert.equal(page.status, 200);
  assert.match(page.title, new RegExp(service.name, "u"));
  assert.match(head, /<link rel="canonical"/u);
  assert.match(head, /"@type":"Service"/u);
  assert.doesNotMatch(head, /"@type":"Service"[^}]*"inLanguage"/u);
  assert.match(head, /data-seo="json-ld"/u);
  assert.match(head, /<link rel="preload" as="image"/u);
});

test("home hero can be discovered from the response head before client data loads", () => {
  const content = getFallbackContent();
  content.imageResources["home.hero"] = {
    imageUrl: "https://ik.imagekit.io/fionaspa/Home_AboutUs_Blog/hero.png",
    imageFallback: ""
  };
  const page = buildSeoPageModel(content, "/en", productionHost);
  const head = renderSeoHead(page);
  assert.match(head, /<link rel="preload" as="image"/u);
  assert.match(head, /tr:w-1600,q-80,f-auto\/Home_AboutUs_Blog\/hero\.png/u);
});

test("query strings are excluded from canonical and path variants redirect to lowercase without slash", () => {
  const page = buildSeoPageModel(getFallbackContent(), "/en/services", productionHost);
  assert.equal(page.canonicalUrl, "https://fionaspadanang.com/en/services");
  assert.equal(normalizeRequestPath("/EN/Services/", "?category=massage"), "/en/services?category=massage");
  assert.equal(normalizeRequestPath("/en/services", "?category=massage"), undefined);
});

test("robots and sitemap remain locked to the production domain and English locale", async () => {
  const environment = {
    VITE_SITE_URL: "https://fionaspadanang.com",
    VITE_INDEX_ALL_LOCALES: "false"
  };
  const robots = buildRobotsTxt(environment, "https://preview.example/robots.txt");
  const sitemap = await buildSitemapXml(environment, "https://preview.example/sitemap.xml");
  assert.match(robots, /Sitemap: https:\/\/fionaspadanang\.com\/sitemap\.xml/u);
  assert.match(sitemap, /<loc>https:\/\/fionaspadanang\.com\/en<\/loc>/u);
  assert.doesNotMatch(sitemap, /fionaspadanang\.com\/(vi|ko|zh)(?:<|\/)/u);
});
