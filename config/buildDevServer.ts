import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { BuildOptions } from "./types/types";

export function buildDevServer({ paths, port, domains }: BuildOptions): DevServerConfiguration {
    return {
        port: port ?? 3000,
        open: true,
        hot: false, // enaible for HMR
        watchFiles: [
            '**/*.php', // track changes to all php files in a project
            paths.src  // track changes to all files in src folder
        ],
        devMiddleware: {
            writeToDisk: true,
        },
        allowedHosts: domains
    }
}