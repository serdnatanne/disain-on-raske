import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  publicDir: false,
  server: {
    fs: {
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
        "**/.analysis/**",
        "**/*.pdf",
        "**/FireShot*.png",
        "**/eksamik*.txt",
      ],
    },
  },
});
