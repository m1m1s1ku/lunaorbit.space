/* eslint-disable @typescript-eslint/no-var-requires */
const { merge }= require('webpack-merge');

const { ProvidePlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const { resolve, join } = require('path');

const ENV = process.argv.find(arg => arg.includes('--mode=production'))
  ? 'production'
  : 'development';

console.warn('Building for :', ENV);
const OUTPUT_PATH = ENV === 'production' ? resolve('dist') : resolve('src');
const INDEX_TEMPLATE = resolve('./src/index.ejs');

const nodeModules = './node_modules/';

const webcomponentsjs = join(nodeModules, '@webcomponents/webcomponentsjs');

const assets = [
  {
    from: resolve('./src/styles.css'),
    to: join(OUTPUT_PATH, 'assets')
  },
  {
    from: resolve('./src/assets'),
    to: join(OUTPUT_PATH, 'assets')
  }
];

const polyfills = [
  {
    from: resolve('./src/assets'),
    to: join(OUTPUT_PATH, 'assets')
  },
  {
    from: resolve(`${webcomponentsjs}/webcomponents-*.js`),
    to: join(OUTPUT_PATH, 'vendor')
  },
  {
    from: resolve(`${webcomponentsjs}/bundles/*.js`),
    to: join(OUTPUT_PATH, 'vendor', 'bundles')
  },
  {
    from: resolve('./src/favicon.ico'),
    to: OUTPUT_PATH
  },
  {
    from: resolve('./src/robots.txt'),
    to: OUTPUT_PATH,
  }
];

const subDirectory = ENV === 'production' ? '' : '';

const commonConfig = merge([
  {
    entry: './src/luna-orbit.ts',
    output: {
      path: OUTPUT_PATH,
      filename: '[name].[chunkhash:8].js',
      publicPath: ENV === 'production' ? '/' : '/'
    },
    resolve: {
      alias: {
        modernizr$: resolve(__dirname, ".modernizrrc")
      },
      extensions: [ '.ts', '.js', '.css' ],
      fallback: {
        "buffer": require.resolve('buffer'),
        "stream": require.resolve('stream-browserify'),
      }
    },
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          test: /\.css$/i,
          include: resolve(__dirname, 'src'),
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },  
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            'url-loader?limit=10000',
            'img-loader'
          ]
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        },
        {
          enforce: 'pre',
          test: /\.tsx?$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true,
            emitWarning: ENV === 'development',
            failOnWarning: ENV === 'development',
            failOnError: false
          }
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.ejs/,
          loader: 'ejs-loader',
          exclude: /node_modules/,
          options: {
            esModule: false
          }
        },
        {
          test: /\.modernizrrc.js$/,
          use: [ '@sect/modernizr-loader' ]
        },
        {
          test: /\.modernizrrc(\.json)?$/,
          use: [ '@sect/modernizr-loader', 'json-loader' ]
        }
      ]
    }
  }
]);

const developmentConfig = merge([
  {
    devtool: 'eval-cheap-source-map',
    plugins: [
      new NodePolyfillPlugin(),
      new CopyWebpackPlugin({patterns: [...polyfills, ...assets]}),
      new HtmlWebpackPlugin({
        template: INDEX_TEMPLATE
      }),
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      })
    ],

    devServer: {
      contentBase: OUTPUT_PATH,
      compress: true,
      overlay: true,
      port: 3000,
      historyApiFallback: true,
      host: '0.0.0.0',
      disableHostCheck: true
    }
  }
]);

const productionConfig = merge([
  {
    devtool: 'nosources-source-map',
    plugins: [
      new NodePolyfillPlugin(),
      new CleanWebpackPlugin({
        verbose: true
      }),
      new CopyWebpackPlugin({patterns: [...polyfills, ...assets]}),
      new HtmlWebpackPlugin({
        pathname: `${subDirectory ? '/'+subDirectory : ''}`,
        template: INDEX_TEMPLATE,
        minify: {
          collapseWhitespace: true,
          removeComments: false,
          minifyCSS: true,
          minifyJS: true
        }
      }),
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      })
    ]
  }
]);

module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};

