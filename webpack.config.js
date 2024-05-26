const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const cloudFormation = require('yaml-cfn')

const {Resources} = cloudFormation.yamlParse(fs.readFileSync('template.yml', 'utf-8'))

const entries = () => {
    let multiEntries = {}
    Object.values(Resources)
    .filter(resource => resource.Type === 'AWS::Serverless::Function')
    .forEach(resource => {
        const file = resource.Properties.Handler.split('.')[0]
        const prefix = resource.Properties.CodeUri.substring(5) // eliminate dist/
        multiEntries[prefix] = `./src/application/${prefix}/${file}.ts`
    })
    return multiEntries
}
module.exports = {
    mode: 'development',
    entry: entries(),
    optimization: {
        minimize: false
    },
    target: 'node16',
    output: {
        library: {
            type: 'commonjs'
        },
        path: path.join(__dirname, 'dist'),
        filename: '[name]/index.js', // it's actually [prefix]
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: [/node_modules/],
            }
        ]
    }
  };
