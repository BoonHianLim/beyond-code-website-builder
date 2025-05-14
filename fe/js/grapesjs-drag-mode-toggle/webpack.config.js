const path = require('path')

module.exports = ({ config }) => {
	return {
		entry: './src/index.js', // your entry file
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'index.js',
			library: {
				type: 'module'
			}
		},
		experiments: {
			outputModule: true // Enable module output.
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		},
		devtool: 'source-map',
		mode: 'production',
		optimization: {
			minimize: false // as you've already set
		}
	}
}
