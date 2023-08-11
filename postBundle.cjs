const fs = require('fs')
const path = require('path')

const bundlePath = path.resolve(__dirname, 'dist/bundle.cjs')

fs.readFile(bundlePath, 'utf8', (err, content) => {
  if (err) {
    console.error('An error occurred:', err)
    return
  }

  const modifiedContent = content.replace(
    'module.exports=r',
    'module.exports=r.default',
  )

  fs.writeFile(bundlePath, modifiedContent, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('An error occurred while writing the file:', writeErr)
    } else {
      console.log('File successfully modified.')
    }
  })
})
