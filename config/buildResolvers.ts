import { Configuration } from "webpack";
import { BuildOptions } from "./types/types";

export function buildResolvers({ paths }: BuildOptions): Configuration['resolve'] {
    return {
        extensions: ['.ts', '.js'],
        alias: {
            '@': paths.src,
        }
    }
}