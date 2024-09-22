import { buildWebpack } from './config/buildWebpack';
import { BuildDomains, BuildMode, BuildPaths } from './config/types/types';
import path from 'path';
import webpack from 'webpack';
import fs from 'fs';

interface EnvVariables {
    mode?: BuildMode;
    port?: number;
}

export default (env: EnvVariables) => {
    const paths: BuildPaths = {
        entry: {
            app: path.resolve(__dirname, 'src/ts/app.ts'),
            style: path.resolve(__dirname, 'src/scss/style.scss'),
        },
        output: path.resolve(__dirname, 'assets'),
        src: path.resolve(__dirname, 'src'),
    }

    const domains: BuildDomains = [
        'your-local-domain.local', // Replace with your domain
    ];

    const httpsConfig = {
        key: fs.readFileSync('path/to/your/cert.key'), // Replace with your certificate key path
        cert: fs.readFileSync('path/to/your/cert.crt'), // Replace with your certificate path
    };

    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3000,
        mode: env.mode ?? 'development',
        paths,
        domains,
        httpsConfig,
    })

    return config;
}