const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_environment, arguments_) => {
  const isProduction = arguments_.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.tsx",
    devtool: isProduction ? false : "eval-cheap-module-source-map",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "assets/[name].[contenthash:8].js",
      chunkFilename: "assets/[name].[contenthash:8].chunk.js",
      publicPath: "/",
      clean: true,
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/[name].[contenthash:8][ext][query]",
          },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        minify: isProduction,
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "assets/[name].[contenthash:8].css",
              chunkFilename: "assets/[name].[contenthash:8].chunk.css",
            }),
          ]
        : []),
    ],

    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
      },
    },

    devServer: {
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },

    performance: {
      hints: isProduction ? "warning" : false,
    },

    stats: "errors-warnings",
  };
};
