import typescript from "@rollup/plugin-typescript"
// import commonjs from "@rollup/plugin-commonjs"

/** @type {import('typescript').CompilerOptions} */
const tsOptions = {
    downlevelIteration: true,
}

/** @type {import('rollup').RollupOptions} */
const config = {
    // input: [
    //     "./src/main.ts",
    //     "./src/Program.ts",
    // ],
    input: "./src/cli/main.ts",
    output: [
        // {
        //     // dir: "dist",
        //     format: "esm",
        //     file: "./bin/main.mjs",
        //     inlineDynamicImports: true,
        // },
        {
            file: "bin/main.cjs",
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
            banner: '#! /usr/bin/env node',
        },
    ],
    external: [
    ],
    plugins: [
        typescript({
            tsconfig: "tsconfig.rollup.json",
            exclude: "./test/**/*.ts",
            // inlineSources: true,
        }),
        // commonjs({ extensions: [".js", ".ts"] }) // the ".ts" extension is required
    ],
}

export default config
