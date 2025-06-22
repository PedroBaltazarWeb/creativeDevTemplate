//Ficheiro de inicial;
//Serve como coordenador

const path = require('path') //Módulo Nativo do Node para manipular caminhos de arquivos
const webpack = require('webpack') //Importa o próprio Webpack para aceder a pugins e variáveis de ambiente

const CopyWebpackPlugin = require('copy-webpack-plugin') //copiar arquivos de uma pasta para outra durante o build
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //extrai CSS de dentro do JS e cria arquivos .css separados
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //limpa a pasta public
const TerserPlugin = require("terser-webpack-plugin"); //minify JS

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev' //isto vai permitir condicionar o config do WP 

//"dirname" é uma variavel global do Node.JS, representa o caminho absoluto do diretório onde o arquivo está localizado

const dirApp = path.join(__dirname, 'app')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
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
            dirShared,
            dirStyles,
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
        }),

        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify, // Diz ao plugin para usar a implementação baseada no imagemin
                options: {
                    plugins: [
                        ['gifsicle', {interlaced: true}], //Otimiza GIFs, interlaced: true melhora carregamento progressivo.
                        ['jpegtran', {progressive: true}], //Cria JPEGs otimizados, progressive: true permite mostrar a imagem em camadas ao carregar.
                        ['optipng', {optimizationLevel: 5}], //Otimiza PNGs. optimizationLevel: 5 ajusta o grau de compressão (vai de 0 a 7).
                        ['svgo', {}], //Remove metadados e simplifica SVGs para reduzir o tamanho.
                    ],
                },
             },
        }),
        new CleanWebpackPlugin(),
    ],

    //Ver Asset Modules em vez de file-loader
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader' //transforma o código JS para código compatível até com os navegadores mais antigos, ao usar o Babel
                }
            },
            {
                test: /\.scss$/,
                use: [ // todos estes loaders pocessam os ficheiros .scss para que sejam "convertidos" para CSS
                    {
                        loader: MiniCssExtractPlugin.loader, //CSS final para um ficheiro separado
                        options: {
                            publicPath: '' 
                        }
                    },
                    {
                        loader: 'css-loader', //permite que o CSS seja interpretado como um módulo de JS (import './style.scss')
                    },
                    {
                        loader: 'postcss-loader', // APLICA PREFIXOS
                    },
                    {
                        loader: 'sass-loader', //compila SCSS para CSS
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
                loader: 'file-loader', //copia estes tipo de ficheiros para uma pasta dist e devolve URL para que sejam usados no projeto (background: url(......))
                options: {
                    name () {
                        return '[hash].[ext]' //Melhor desempenho e SEO	Riscos de exibir conteúdo antigo
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                enforce: "pre", //executada antes dos outros loaders
                use: [
                    {
                        loader: ImageMinimizerPlugin.loader,
                        options: {
                            minimizer: {
                                implementation: ImageMinimizerPlugin.imageminMinify,
                                options: {
                                    plugins: [
                                        ['gifsicle', { interlaced: true }],
                                        ['jpegtran', { progressive: true }],
                                        ['optipng', { optimizationLevel: 5 }],
                                        ['svgo', {}],
                                    ],
                                },
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(glsl|frag|vert)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',      // carrega como string
                    'glslify-loader'   // pré-processa com glslify
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
}
