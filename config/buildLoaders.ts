import { ModuleOptions } from "webpack";
import { BuildOptions } from "./types/types";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
    const isDev = options.mode === 'development';

    const babelLoader = {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets: [
                    '@babel/preset-env',
                    "@babel/preset-typescript",
                ],
            }
        }
    };

    const scssLoader = {
        test: /\.s[ac]ss$/i,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
        ]
    }

    const imageLoader = {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'img/[name].[ext]',
                },
            },
            {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                        progressive: true,
                    },
                    optipng: {
                        enabled: false,
                    },
                    pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4,
                    },
                    gifsicle: {
                        interlaced: false,
                    },
                    webp: {
                        quality: 75,
                    },
                },
            },

        ],
    };


    return [
        babelLoader,
        scssLoader,
        // imageLoader,
    ]
}