globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import gracefulShutdown from 'http-graceful-shutdown';

const defineAppConfig = (config) => config;

const appConfig0 = defineAppConfig({
  ui: {
    primary: "#ff8f6b",
    orange: "#ff8f6b",
    button: {
      // default: {
      //   color: 'orange',
      // },
      default: {
        color: "#ff8f6b"
      }
    }
  }
});

const inlineAppConfig = {
  "ui": {
    "primary": "green",
    "gray": "cool",
    "colors": [
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
      "primary"
    ]
  }
};

const appConfig = defuFn(appConfig0, inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {}
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const script = "\"use strict\";(()=>{const a=window,e=document.documentElement,m=[\"dark\",\"light\"],c=window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let n=c===\"system\"?f():c;const l=e.getAttribute(\"data-color-mode-forced\");l&&(n=l),i(n),a[\"__NUXT_COLOR_MODE__\"]={preference:c,value:n,getColorScheme:f,addColorScheme:i,removeColorScheme:d};function i(o){const t=\"\"+o+\"\",s=\"\";e.classList?e.classList.add(t):e.className+=\" \"+t,s&&e.setAttribute(\"data-\"+s,o)}function d(o){const t=\"\"+o+\"\",s=\"\";e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp(t,\"g\"),\"\"),s&&e.removeAttribute(\"data-\"+s)}function r(o){return a.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function f(){if(a.matchMedia&&r(\"\").media!==\"not all\"){for(const o of m)if(r(\":\"+o).matches)return o}return\"light\"}})();\n";

const _jG74FCD50H = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _jG74FCD50H
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function trapUnhandledNodeErrors() {
  {
    process.on(
      "unhandledRejection",
      (err) => console.error("[nitro] [unhandledRejection] " + err)
    );
    process.on(
      "uncaughtException",
      (err) => console.error("[nitro]  [uncaughtException] " + err)
    );
  }
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(html);
});

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-07-29T12:15:30.000Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/Avatar.8b1122f4.js": {
    "type": "application/javascript",
    "etag": "\"1b96-AyT8SGoOo5qz0XqAjsRLCyvtTzM\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 7062,
    "path": "../public/_nuxt/Avatar.8b1122f4.js"
  },
  "/_nuxt/Button.76eacea6.js": {
    "type": "application/javascript",
    "etag": "\"cce-K3ly2Prh0hr7ajkllGefAh5moo4\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 3278,
    "path": "../public/_nuxt/Button.76eacea6.js"
  },
  "/_nuxt/d-collapse.c3fc4ff8.svg": {
    "type": "image/svg+xml",
    "etag": "\"142-QKtJmdm1i/WLa+w8QxrLZifX+/w\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 322,
    "path": "../public/_nuxt/d-collapse.c3fc4ff8.svg"
  },
  "/_nuxt/dayjs.min.dc50587d.js": {
    "type": "application/javascript",
    "etag": "\"1c40-cEH2a+F0N070CczEHYpXdclePoE\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 7232,
    "path": "../public/_nuxt/dayjs.min.dc50587d.js"
  },
  "/_nuxt/el-button.31ad6e99.js": {
    "type": "application/javascript",
    "etag": "\"2c1f9-TSgOPmFTbp7KBniqiGdCremugPw\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 180729,
    "path": "../public/_nuxt/el-button.31ad6e99.js"
  },
  "/_nuxt/el-button.991afd78.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f96a-QjvWVbXr/AbBPPdi+jO71IeWL3k\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 63850,
    "path": "../public/_nuxt/el-button.991afd78.css"
  },
  "/_nuxt/el-progress.3adff50a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4daf-qBFWy5kj6hEHScTe5THTBpGBB0U\"",
    "mtime": "2023-08-25T14:08:22.577Z",
    "size": 19887,
    "path": "../public/_nuxt/el-progress.3adff50a.css"
  },
  "/_nuxt/el-progress.b1c6187d.js": {
    "type": "application/javascript",
    "etag": "\"ed8f-xJ9Tq2hELUJaLJ1drRDNXfl8IoU\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 60815,
    "path": "../public/_nuxt/el-progress.b1c6187d.js"
  },
  "/_nuxt/entry.1bed2ab6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"69e70-ZyXxTOJTabR7NRK4dxtR0hk3/74\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 433776,
    "path": "../public/_nuxt/entry.1bed2ab6.css"
  },
  "/_nuxt/entry.ebd3bb8a.js": {
    "type": "application/javascript",
    "etag": "\"2e540-uxnApVHmnTvV9HM4Nvo77K5T+xg\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 189760,
    "path": "../public/_nuxt/entry.ebd3bb8a.js"
  },
  "/_nuxt/error-404.49a4b935.js": {
    "type": "application/javascript",
    "etag": "\"8cd-TISMcioL48coMfQ9sPJiS4lybjc\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 2253,
    "path": "../public/_nuxt/error-404.49a4b935.js"
  },
  "/_nuxt/error-404.871584dc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-/i/RgmdoCkRRXzmcLKAwUns807c\"",
    "mtime": "2023-08-25T14:08:22.577Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.871584dc.css"
  },
  "/_nuxt/error-500.5504fd74.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-1qS2/UnuTXlOTLpmd6jF7wkaoFU\"",
    "mtime": "2023-08-25T14:08:22.575Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.5504fd74.css"
  },
  "/_nuxt/error-500.c1b9849d.js": {
    "type": "application/javascript",
    "etag": "\"756-VgLBoZGK92wpzMeA/meavnKk1PQ\"",
    "mtime": "2023-08-25T14:08:22.579Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.c1b9849d.js"
  },
  "/_nuxt/fetch.0affcee4.js": {
    "type": "application/javascript",
    "etag": "\"2d39-CpbKzAZq7HTHAW/s+oYvOj+2/t4\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 11577,
    "path": "../public/_nuxt/fetch.0affcee4.js"
  },
  "/_nuxt/index.948e5a5f.js": {
    "type": "application/javascript",
    "etag": "\"c49-UqL2RUxwyPbM85hLDBPWMtomf1M\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 3145,
    "path": "../public/_nuxt/index.948e5a5f.js"
  },
  "/_nuxt/Link.7fab82c8.js": {
    "type": "application/javascript",
    "etag": "\"3cc1-/Uz3UqWyeJj0hNjE7l2oHHMn7G8\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 15553,
    "path": "../public/_nuxt/Link.7fab82c8.js"
  },
  "/_nuxt/nuxt-link.65fe6b0a.js": {
    "type": "application/javascript",
    "etag": "\"1105-OWSJoOgckEcirqyQffvwnf74erw\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 4357,
    "path": "../public/_nuxt/nuxt-link.65fe6b0a.js"
  },
  "/_nuxt/omit.a19d229c.js": {
    "type": "application/javascript",
    "etag": "\"73d-/P9K9RCnR0yn+mzw8mri/NLzCZw\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 1853,
    "path": "../public/_nuxt/omit.a19d229c.js"
  },
  "/_nuxt/pc.b19c06a6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"445-luezelUnZ+NWfKwSP8UWgywD+jU\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 1093,
    "path": "../public/_nuxt/pc.b19c06a6.css"
  },
  "/_nuxt/pc.b29a8e62.js": {
    "type": "application/javascript",
    "etag": "\"e53-Ll6a1cBfGJxXAAO8tNjQMXCh05o\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 3667,
    "path": "../public/_nuxt/pc.b29a8e62.js"
  },
  "/_nuxt/SelectMenu.d9f3361b.js": {
    "type": "application/javascript",
    "etag": "\"10f31-PUSpTlVWls4s1V8LgYEJnwe0Jqg\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 69425,
    "path": "../public/_nuxt/SelectMenu.d9f3361b.js"
  },
  "/_nuxt/svg_preview.43446614.js": {
    "type": "application/javascript",
    "etag": "\"d0c-uaG/dtA3NS8yoGQSJ+AwtKs41vQ\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 3340,
    "path": "../public/_nuxt/svg_preview.43446614.js"
  },
  "/_nuxt/Test.8ab53397.js": {
    "type": "application/javascript",
    "etag": "\"971-jEgkk5M3hsAToalfhDaGNzubrmg\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 2417,
    "path": "../public/_nuxt/Test.8ab53397.js"
  },
  "/_nuxt/t_create_online.622dd888.js": {
    "type": "application/javascript",
    "etag": "\"188c-q0l4FNufDcxICwv1tq8kPMmkU5Q\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 6284,
    "path": "../public/_nuxt/t_create_online.622dd888.js"
  },
  "/_nuxt/t_detail.e3343434.js": {
    "type": "application/javascript",
    "etag": "\"1ab0-tBHbtpJYmhEhG3Mvp72Su6mVezU\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 6832,
    "path": "../public/_nuxt/t_detail.e3343434.js"
  },
  "/_nuxt/t_info.05c3e4cd.js": {
    "type": "application/javascript",
    "etag": "\"5ab1-lzXsCL0tiww+UyFwAXIFBCQ93Cw\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 23217,
    "path": "../public/_nuxt/t_info.05c3e4cd.js"
  },
  "/_nuxt/t_list.619ac518.js": {
    "type": "application/javascript",
    "etag": "\"43f1-VuKvgU+X17sq0rTdvvDJp9SDgTU\"",
    "mtime": "2023-08-25T14:08:22.580Z",
    "size": 17393,
    "path": "../public/_nuxt/t_list.619ac518.js"
  },
  "/_nuxt/utc.5c4aeaac.js": {
    "type": "application/javascript",
    "etag": "\"104b-lsHFaIE7S41Owxhx/dAXulj6KaQ\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 4171,
    "path": "../public/_nuxt/utc.5c4aeaac.js"
  },
  "/_nuxt/_id_.4711c757.js": {
    "type": "application/javascript",
    "etag": "\"7c-ORKg/PmgWcLa9rQJg51DNZeksMc\"",
    "mtime": "2023-08-25T14:08:22.578Z",
    "size": 124,
    "path": "../public/_nuxt/_id_.4711c757.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_aOvIOY = () => import('../_id_.mjs');
const _lazy_FJnwEx = () => import('../t_create.post.mjs');
const _lazy_wOIqRD = () => import('../t_update.patch.mjs');
const _lazy_3xS4nh = () => import('../t_delete.post.mjs');
const _lazy_HOUo3E = () => import('../t_getAll.get.mjs');
const _lazy_TipXEM = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/api/t_info/:id', handler: _lazy_aOvIOY, lazy: true, middleware: false, method: undefined },
  { route: '/api/t_info/t_create', handler: _lazy_FJnwEx, lazy: true, middleware: false, method: "post" },
  { route: '/api/t_info/t_update', handler: _lazy_wOIqRD, lazy: true, middleware: false, method: "patch" },
  { route: '/api/t_list/t_delete', handler: _lazy_3xS4nh, lazy: true, middleware: false, method: "post" },
  { route: '/api/t_list/t_getAll', handler: _lazy_HOUo3E, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_TipXEM, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_TipXEM, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT, 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  gracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((err) => {
          console.error(err);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const listener = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
