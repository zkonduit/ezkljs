const path = require('path')

module.exports = [
  // CommonJS Configuration
  {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.cjs.json',
            },
          },
          include: [path.resolve(__dirname, 'src')],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.wasm'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      filename: 'bundle.cjs',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs2',
      globalObject: 'this',
    },
  },

  // ES Modules Configuration
  {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.esm.json',
            },
          },
          include: [path.resolve(__dirname, 'src')],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.wasm'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      filename: 'bundle.mjs',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
  },
]
