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
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'img/[name][ext][query]',
        },
    };
    
    const svgLoader = {
        test: /\.svg$/i,
        type: 'asset/resource',
        generator: {
            filename: 'img/[name][ext][query]',
        },
    };

    const fontsLoader = {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
            filename: 'fonts/[name][ext][query]'
        }
    }


    return [
        babelLoader,
        scssLoader,
        fontsLoader,
        imageLoader,
        svgLoader,
    ]
}