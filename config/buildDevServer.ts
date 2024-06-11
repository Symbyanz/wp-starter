import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { BuildOptions } from "./types/types";

export function buildDevServer({ paths, port, domains }: BuildOptions): DevServerConfiguration {
    return {
        port: port ?? 3000,
        open: true,
        hot: false, // enaible for HMR
        watchFiles: [paths.src],
        devMiddleware: {
            writeToDisk: true,
        },
        allowedHosts: domains
    }
}