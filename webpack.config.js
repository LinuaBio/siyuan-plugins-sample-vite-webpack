const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const { EsbuildPlugin } = require("esbuild-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const ZipPlugin = require("zip-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader/dist/index");
const { compileScript } = require("@vue/compiler-sfc");
const outPath = "/disk";
const glob = require("glob");

module.exports = (env, argv) => {
    const isPro = argv.mode === "production";
    const plugins = [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: isPro ? "index.css" : "index.css",
        })
    ];
    let entry = {
        "index": "./src/index.ts",
    };
    if (isPro) {
        entry = {
            "index": "./src/index.ts",
        };
        plugins.push(new webpack.BannerPlugin({
            banner: () => {
                return fs.readFileSync("LICENSE").toString();
            },
        }));
        plugins.push(new CopyPlugin({
            patterns: [
                { from: "preview.png", to: "./" + outPath + "/" },
                { from: "icon.png", to: "./" + outPath + "/" },
                { from: "README*.md", to: "./" + outPath + "/" },
                { from: "plugin.json", to: "./" + outPath + "/" },
                { from: "src/i18n/", to: "./" + outPath + "/i18n/" },
            ],
        }));
        // plugins.push(new ZipPlugin({
        //     filename: "package.zip",
        //     algorithm: "gzip",
        //     include: [/dist/],
        //     pathMapper: (assetPath) => {
        //         return assetPath.replace(outPath+"/", "");
        //     },
        // }));
    }
    return {
        mode: argv.mode || "development",
        watch: !isPro,
        devtool: isPro ? false : "eval",
        output: {
            filename: "[name].js",
            // path: path.resolve(__dirname),
            path: outPath,
            libraryTarget: "commonjs2",
            library: {
                type: "commonjs2",
            },
        },
        externals: {
            siyuan: "siyuan",
            "child_process": "null",
            "electron": "null",
        },
        entry,
        optimization: {
            minimize: true,
            minimizer: [
                new EsbuildPlugin(),
            ],
        },
        resolve: {
            extensions: [".ts", ".scss", "css", ".js", ".vue", ".json"],
            alias: {
                vue$: "vue/dist/vue.esm-bundler.js"
            },
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: [path.resolve(__dirname, "src")],
                    use: [
                        {
                            // loader: "esbuild-loader",
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                                compilerOptions: {
                                    target: "es6" // 或者任何你需要的目标版本
                                },
                                // target: "es6",
                            }
                        },
                    ],
                },
                // {
                //     test: /\.scss$/,
                //     include: [path.resolve(__dirname, "src")],
                //     use: [
                //         MiniCssExtractPlugin.loader,
                //         {
                //             loader: "css-loader", // translates CSS into CommonJS
                //         },
                //         {
                //             loader: "postcss-loader", // 添加postcss-loader，用于处理兼容性问题
                //             options: {
                //                 postcssOptions: {
                //                     config: path.resolve(__dirname, "postcss.config.js"), // 指定postcss插件配置文件
                //                 },
                //             },
                //         },
                //         {
                //             loader: "sass-loader", // compiles Sass to CSS
                //         },
                //         {
                //             loader: "style-resources-loader",
                //             options: {
                //                 scss: glob.sync("src/**/*.scss"),
                //             },
                //         }
                //     ],
                // },
                // {
                //     test: /\.vue$/,
                //     loader: "vue-loader",
                // },
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, "src")],
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            // translates CSS into CommonJS 
                        },
                        {
                            loader: "postcss-loader",
                            // 添加postcss-loader，用于处理兼容性问题 
                            options: {
                                postcssOptions: {
                                    config: path.resolve(__dirname, "postcss.config.js"),
                                    // 指定postcss插件配置文件 
                                },
                            },
                        },
                        {
                            loader: "sass-loader",
                            // compiles Sass to CSS 
                        },
                        {
                            loader: "style-resources-loader",
                            options: {
                                patterns: glob.sync("src/**/*.scss"),
                            },
                        },
                    ],
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    options: {
                        // 处理vue单文件组件中的样式
                        loaders: {
                            scss: ["vue-style-loader", "css-loader", "postcss-loader", "sass-loader"],
                            css: ["vue-style-loader", "css-loader", "postcss-loader"],
                        },
                        // 将common scss 变量、mixin和functions注入到所有单文件组件中
                        styleResources: {
                            scss: glob.sync("src/**/*.scss"),
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader"
                    ],
                },

                {
                    resourceQuery: /blockType=setup/,
                    use: [
                        "babel-loader",
                        {
                            loader: "@vue/compiler-sfc/dist/exports-loader",
                            options: {
                                // 除了 script setup 区块的内容之外，其他的都需要被忽略。
                                // 这样可以避免编译器尝试编译其他区块，并且加速构建过程。
                                exports: "default"
                            }
                        },
                        {
                            loader: "@vue/compiler-sfc/dist/one-loader",
                            options: {
                                // 将 setup 区块编译成 script 代码
                                compiler: compileScript,
                                // 要求编译过程中包含 TypeScript 类型检查
                                needMap: true
                            }
                        }
                    ]
                },
            ],
        },
        plugins,
    };
};
