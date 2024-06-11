import webpack, { Configuration } from "webpack";
import { BuildOptions } from "./types/types";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { IgnoreEmitPlugin } from "ignore-emit-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";


export function buildPlugins({ mode, paths }: BuildOptions): Configuration['plugins'] {
    const isDev = mode === 'development';
    const isProd = mode === 'production';

    const plugins: Configuration['plugins'] = [
        new MiniCssExtractPlugin({
            filename: 'css/style.css'
        }),
        new IgnoreEmitPlugin(['style.js']),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.src,
                    to: paths.output,
                    globOptions: {
                        ignore: [
                            '**/scss/**',
                            '**/ts/**',
                        ],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),
    ];

    if (isDev) {
        plugins.push(new webpack.ProgressPlugin());
    }

    if (isProd) {
        plugins.push(
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                extractComments: false,
                terserOptions: {
                    compress: {},
                    mangle: true,
                },
            }),
        );
    }
    return plugins;
}
