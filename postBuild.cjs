const fs = require('fs')
// import fs from 'fs'
// import path from 'path'
const path = require('path')

const cjsOutput = path.resolve(__dirname, 'dist/bundle.commonjs.js')
const content = fs.readFileSync(cjsOutput, 'utf8')
const modifiedContent = content.replace('exports.default =', 'module.exports =')
fs.writeFileSync(cjsOutput, modifiedContent)

console.log('Post-build script completed.')
