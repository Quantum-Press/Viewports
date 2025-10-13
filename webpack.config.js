/**
 * Requires.
 */
const path = require( 'path' );
const TerserPlugin = require( 'terser-webpack-plugin' );
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
			filename: 'quantum-viewports.css',
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
			'@quantum-viewports/components': path.resolve( __dirname, 'src/components' ),
			'@quantum-viewports/config': path.resolve( __dirname, 'src/config' ),
			'@quantum-viewports/hacks': path.resolve( __dirname, 'src/hacks' ),
			'@quantum-viewports/hooks': path.resolve( __dirname, 'src/hooks' ),
			'@quantum-viewports/store': path.resolve( __dirname, 'src/store' ),
			'@quantum-viewports/types': path.resolve( __dirname, 'src/types' ),
			'@quantum-viewports/utils': path.resolve( __dirname, 'src/utils' ),
		},
	},
	output: {
		filename: 'quantum-viewports.js',
		path: path.resolve( __dirname, 'build' ),
		clean: true,
	},
	cache: {
		type: 'filesystem',
	},
	optimization: {
		minimize: env.production,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: {
						reserved: [
							'__',
							'_e',
							'_x',
							'_ex',
							'esc_html__',
							'esc_html_e',
							'esc_attr__',
							'esc_attr_e',
							'_n'
						],
					},
				},
			}),
		],
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
} );
