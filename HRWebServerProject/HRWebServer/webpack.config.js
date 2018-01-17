var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app/app.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            'HomePage': path.resolve(__dirname, './app/components/HomePage'),
            'TopNav': path.resolve(__dirname, './app/components/TopNav'),
            'HomePageSearch': path.resolve(__dirname, './app/components/HomePageSearch'),
            'Carousel': path.resolve(__dirname, './app/components/Carousel'),
            'JobList': path.resolve(__dirname, './app/components/JobList'),
            'EmployerPage': path.resolve(__dirname, './app/components/EmployerPage'),
            'Footer': path.resolve(__dirname, './app/components/Footer'),
            'BreadCrumb': path.resolve(__dirname, './app/components/BreadCrumb'),
            'AppAdvertisement': path.resolve(__dirname, './app/components/AppAdvertisement'),
            'Follow': path.resolve(__dirname, './app/components/Follow'),
            'App': path.resolve(__dirname, './app/components/App'),
            'JobFormModal': path.resolve(__dirname, './app/components/JobFormModal'),
            'ImageBox': path.resolve(__dirname, './app/components/ImageBox'),
            'JobGrid': path.resolve(__dirname, './app/components/JobGrid'),
            'Error404Page': path.resolve(__dirname, './app/components/Error404Page'),
            'ResultJobSearchPage': path.resolve(__dirname, './app/components/ResultJobSearchPage'),
            'Pagination': path.resolve(__dirname, './app/components/Pagination'),
            'JobDetailPage': path.resolve(__dirname, './app/components/JobDetailPage'),
        },
        extensions: ['.js', '.jsx'],
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loaders: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['env', 'es2015', 'react', 'stage-0'],
                }
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.exec\.js$/,
                use: ['script-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loader: 'url-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './img/local_img', to: './img' },
        ]),
    ]
};
