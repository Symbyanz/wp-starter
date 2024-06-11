import { buildWebpack } from './config/buildWebpack';
import { BuildDomains, BuildMode, BuildPaths } from './config/types/types';
import path from 'path';
import webpack from 'webpack';

interface EnvVariables {
    mode?: BuildMode;
    port?: number;
}

export default (env: EnvVariables) => {
    const paths: BuildPaths = {
        entry: {
            app: path.resolve(__dirname, 'src/ts/app.ts'),
            vendors: path.resolve(__dirname, 'src/ts/vendors.ts'),
            style: path.resolve(__dirname, 'src/scss/style.scss'),
        },
        output: path.resolve(__dirname, 'assets'),
        src: path.resolve(__dirname, 'src'),
    }

    const domains: BuildDomains = [
        'market'
    ];

    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3000,
        mode: env.mode ?? 'development',
        paths,
        domains,
    })

    return config;
}