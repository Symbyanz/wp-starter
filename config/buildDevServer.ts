import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { BuildOptions } from './types/types';

export function buildDevServer({ paths, port, domains, httpsConfig }: BuildOptions): DevServerConfiguration {
    return {
        port: port ?? 3000,
        open: true,
        hot: false,
        watchFiles: [
            '**/*.php',
            paths.src,
        ],
        devMiddleware: {
            writeToDisk: true,
        },
        allowedHosts: domains,
        server: httpsConfig ? { type: 'https', options: httpsConfig } : { type: 'http' },
    };
}