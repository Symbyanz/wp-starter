import webpack from "webpack";
import { BuildOptions } from "./types/types";
import { buildPlugins } from "./buildPlugins";
import { buildLoaders } from "./buildLoaders";
import { buildResolvers } from "./buildResolvers";
import { buildDevServer } from "./buildDevServer";
import { buildOptimization } from "./buildOptimization";

export function buildWebpack(options: BuildOptions): webpack.Configuration {
    const { mode, paths } = options;
    const isDev = mode === 'development';

    return {
        mode,
        entry: {
            app: paths.entry.app,
            // vendors: paths.entry.vendors,
            style: paths.entry.style,
        },
        output: {
            path: paths.output,
            filename: 'js/[name].js',
            clean: true
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options),
        },
        resolve: buildResolvers(options),
        optimization: buildOptimization(options),
        devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
        devServer: isDev ? buildDevServer(options) : undefined,
        externals: {
            jquery: 'jQuery',
        },
    }
}