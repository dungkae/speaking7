import { defineConfig, type Plugin, type Connect } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { cp, mkdir, readdir } from "node:fs/promises";

const root = fileURLToPath(new URL(".", import.meta.url));

// Keep the existing browser configuration endpoint available in dev/preview.
const envHandler: Connect.NextHandleFunction = (request, response, next) => {
  if (request.url?.split("?")[0] !== "/api/env.js") return next();
  response.setHeader("Content-Type", "application/javascript");
  response.setHeader("Cache-Control", "no-store");
  response.end('window.env = Object.freeze({});');
};

function legacyPages(): Plugin {
  return {
    name: "speaking7-legacy-pages",
    configureServer(server) { server.middlewares.use(envHandler); },
    configurePreviewServer(server) { server.middlewares.use(envHandler); },
    async closeBundle() {
      // Classic scripts keep their order and paths; React enhances only the CTA.
      await cp(new URL("assets/js", import.meta.url), new URL("dist/assets/js", import.meta.url), { recursive: true });
      await mkdir(new URL("dist/assets/fonts", import.meta.url), { recursive: true });
      for (const name of await readdir(new URL("assets/fonts", import.meta.url))) {
        if (name.endsWith("OFL.txt")) await cp(new URL(`assets/fonts/${name}`, import.meta.url), new URL(`dist/assets/fonts/${name}`, import.meta.url));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), legacyPages()],
  publicDir: false,
  resolve: { alias: { "@": root } },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        ["index", "preview", "account", "login", "signup", "liquid-metal-demo"].map(name => [name, `${root}${name}.html`]),
      ),
    },
  },
});
