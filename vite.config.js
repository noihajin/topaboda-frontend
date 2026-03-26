import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { API_URL } from "./src/config/config";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: `${API_URL}`,
                changeOrigin: true,
                rewrite: (path) => "/topaboda" + path,
                timeout: 60000,
                proxyTimeout: 60000,
            },
            "/img": {
                target: `${API_URL}`,
                changeOrigin: true,
                rewrite: (path) => "/topaboda" + path,
                timeout: 60000,
                proxyTimeout: 60000,
            },
        },
    },
});
