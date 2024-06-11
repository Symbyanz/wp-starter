import { Configuration } from "webpack";
import { BuildOptions } from "./types/types";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";

export function buildOptimization(options: BuildOptions): Configuration['optimization'] {
    return {
        minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            "imagemin-gifsicle",
                            "imagemin-mozjpeg",
                            "imagemin-pngquant",
                            "imagemin-svgo",
                        ],
                    },
                },
                // generator: [
                //     {
                //         type: "asset",
                //         implementation: ImageMinimizerPlugin.imageminGenerate,
                //         options: {
                //             plugins: ["imagemin-webp"],
                //         },
                //     },
                // ],
            }),
        ],
    }
}