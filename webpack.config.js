//Ficheiro de inicial;
//Serve como coordenador

const path = require('path') //Módulo Nativo do Node para manipular caminhos de arquivos
const webpack = require('webpack') //Importa o próprio Webpack para aceder a pugins e variáveis de ambiente

const CopyWebpackPlugin = require('copy-webpack-plugin') //copiar arquivos de uma pasta para outra durante o build
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //extrai CSS de dentro do JS e cria arquivos .css separados

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev' //isto vai permitir condicionar o config do WP 

//"dirname" é uma variavel global do Node.JS, representa o caminho absoluto do diretório onde o arquivo está localizado

const dirApp = path.join(__dirname, 'app')
const dirImages = path.join(__dirname, 'images')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirVideos = path.join(__dirname, 'videos') 
const dirNode = 'node_modules'

module.exports = { // o que está aqui dentro vai ser lido pelo WP para saber como empacotar o projeto
    entry: [ //arquivos de entrada, WP vai começar a partir daqui a construir a árvore de dependencias
        path.join(dirApp, 'index.js'),
        path.join(dirStyles, 'index.scss'),
    ],

    resolve: { // aqui dizemos ao WP onde deve procurar os modulos, que é onde usamos "import" ou "require"
        //por default o WP olha só para os node modules, mas, como está em baixo, expandimos por outros caminhos
        // o que vai permitir importar desta forma:
        /* 
            import Button from 'components/Button'      // Em vez de './app/components/Button'
        */
        modules: [
            dirApp,
            dirImages,
            dirShared,
            dirStyles,
            dirVideos,
            dirNode
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './shared',
                    to: ''
                }
            ]
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css', //name será substituido pelo nome do entry point ()
            chunkFilename: '[id].css' //id é o ID do chunk gerado auitomaticamente pelo Webpack
        })
    ],
    
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: ''
                        }
                    },
                    {
                        loader: 'css-loader', 
                    },
                    {
                        loader: 'postcss-loader', 
                    },
                    {
                        loader: 'sass-loader', 
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
                loader: 'file-loader',
                options: {

                }
            }
        ]
    },
}