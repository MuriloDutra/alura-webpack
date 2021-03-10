const path = require('path')
const babiliPlugin = require('babili-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
let plugins = []

plugins.push(new HtmlWebpackPlugin({
    hash: true,//quando true, adiciona um hash no final da URL dos arquivos script e CSS importados no arquivo HTML gerado, importante para versionamento e cache no navegador. Quando um bundle diferente for gerado, o hash será diferente e isso é suficiente para invalidar o cache do navegador, fazendo-o carregar o arquivo mais novo.
    minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true
    },
    filename: 'index.html',
    template: `${__dirname}/main.html`//caminho do arquivo que servirá como template para geração de index.html.
}))
plugins.push(new extractTextPlugin('styles.css'))
plugins.push(new webpack.ProvidePlugin({
    '$': 'jquery/dist/jquery.js',
    'jQuery': 'jquery/dist/jquery.js'
}))

let SERVICE_URL = JSON.stringify('http://localhost:3000')
if(process.env.NODE_ENV === 'production'){
    SERVICE_URL = JSON.stringify('http://example-api')

    plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
    plugins.push(new babiliPlugin()) //It minifies the bundle
    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            discardComments: {
                removeAll: true,
            }
        },
        canPrint: true
    }))
}

plugins.push(new webpack.DefinePlugin({
    SERVICE_URL: SERVICE_URL,
}))

module.exports = {
    entry: './app-src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader', //Se algo der errado, o 'style-loader' será usado
                    use: 'css-loader'
                })
            },
            { 
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
            },
            { 
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            { 
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'file-loader' 
            },
            { 
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
            },
        ]
    },
    plugins: plugins
}