import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      // {
      //   find: "apollo-upload-client",
      //   replacement: "apollo-upload-client/public",
      // },
    ],
  },
  // optimizeDeps: {
  //   include: ["apollo-upload-client", "@apollo/client", "graphql"],
  // },
});
