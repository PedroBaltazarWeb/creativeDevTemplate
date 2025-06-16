//apenas configurações para o desenvolvimento, de modo a termos mais rapidez e debugging fácil 

const { merge } = require('webpack-merge')
const path = require('path')

const config = require('./webpack.config')

module.exports = merge(config, {
    mode: 'development',

    devtool: 'inline-source-map',

    devServer: {
        devMiddleware: { //intern middleware
            writeToDisk: true, //this way the files will be on the disk (public/)
        },
    },

    output: {
        path: path.resolve(__dirname, 'public')
    }
})