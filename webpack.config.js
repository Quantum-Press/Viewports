/**
 * Requires.
 */
const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );


/**
 * Export settings.
 */
module.exports = ( env ) => ( {
	devtool: env.production ? undefined : 'source-map',
	mode: env.production ? 'production' : 'development',
	entry: {
		core: './src/main.ts',
	},
	plugins: [
		new MiniCssExtractPlugin( {
			filename: 'qp-viewports-[name].css',
		} ),
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: [
					/node_modules/,
					/build/,
				],
				use: [

					// Compile with Babel.
					env.production && {
						loader: 'babel-loader',
						options: {
							presets: [ '@babel/preset-env', '@babel/preset-typescript' ],
							cacheCompression: false,
							cacheDirectory: true,
						},
					},

					// Compile with TypeScript.
					{
						loader: 'ts-loader',
					},

				],
			},
			{
				test: /\.(s(a|c)ss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							implementation: require( 'sass' ), // Prefer `dart-sass`.
						},
					},
				]
			 }
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts' ],
		alias: {
			'@viewports/components': path.resolve( __dirname, 'src/components' ),
			'@viewports/config': path.resolve( __dirname, 'src/config' ),
			'@viewports/hacks': path.resolve( __dirname, 'src/hacks' ),
			'@viewports/hooks': path.resolve( __dirname, 'src/hooks' ),
			'@viewports/store': path.resolve( __dirname, 'src/store' ),
			'@viewports/types': path.resolve( __dirname, 'src/types' ),
			'@viewports/utils': path.resolve( __dirname, 'src/utils' ),
		},
	},
	output: {
		filename: 'qp-viewports.js',
		path: path.resolve( __dirname, 'build' ),
		clean: true,
	},
	cache: {
		type: 'filesystem',
	},
} );
