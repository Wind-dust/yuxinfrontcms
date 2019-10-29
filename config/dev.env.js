'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    CMS_URL: '"http://wwwapi.shyuxi.com/admin/"',
})
