export type BuildMode = 'production' | 'development';
export type BuildDomains = string[];

export interface BuildPaths {
    entry: {
        app: string,
        // vendors: string,
        style: string,
    };
    output: string;
    src: string;
}

export interface BuildOptions {
    port: number;
    paths: BuildPaths;
    mode: BuildMode;
    domains?: BuildDomains;
}