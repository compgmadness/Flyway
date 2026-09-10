import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function classicScripts(): {
  name: string;
  enforce: "post";
  transformIndexHtml: (html: string) => string;
} {
  return {
    name: "flyway-classic-scripts",
    enforce: "post",
    transformIndexHtml(html) {
      return html
        .replaceAll(' type="module"', "")
        .replaceAll(" crossorigin", "")
        .replaceAll(' crossOrigin="anonymous"', "");
    },
  };
}

export default defineConfig({
  base: "./",
  define: {
    "import.meta.env.VITE_APK_BUILD": JSON.stringify("1"),
  },
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), viteReact(), classicScripts()],
  build: {
    outDir: "android/assets/www",
    emptyOutDir: true,
    copyPublicDir: false,
    cssCodeSplit: false,
    modulePreload: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: "apk/index.html",
      output: {
        format: "iife",
        name: "FlywayApp",
        inlineDynamicImports: true,
        entryFileNames: "app.js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
