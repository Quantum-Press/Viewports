/**
 * Requires.
 */
const path = require( 'path' );


/**
 * Export settings.
 */
module.exports = ( env ) => ( {
	devtool: env.production ? undefined : 'source-map',
	mode: env.production ? 'production' : 'development',
	entry: [ './src/main.ts' ],
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
					'style-loader',
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
		extensions: [ '.ts', '.tsx' ],
	},
	output: {
		filename: 'viewports.js',
		path: path.resolve( __dirname, 'build' ),
		clean: true,
	},
	cache: {
		type: 'filesystem',
	},
} );
