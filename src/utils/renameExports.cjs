const fs = require('fs')
const path = require('path')

function renameExports(filePath, renameMappings) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      console.error(err)
      return
    }

    let result = data

    // Replace the function names
    for (const [oldName, newName] of Object.entries(renameMappings)) {
      // Use a negative lookbehind to ensure that "wasm." does not precede the old name
      const regex = new RegExp(`(?<!wasm\\.)${oldName}`, 'g')
      result = result.replace(regex, newName)
    }

    // Write the modified content back to the file
    fs.writeFile(filePath, result, 'utf8', function (err) {
      if (err) {
        console.error(err)
      }
    })
  })
}

const renameMappings = {
  poseidon_hash_wasm: 'poseidonHash',
  elgamal_encrypt_wasm: 'elgamalEncrypt',
  elgamal_decrypt_wasm: 'elgamalDecrypt',
  gen_pk_wasm: 'genPk',
  gen_vk_wasm: 'genVk',
  verify_wasm: 'verify',
  prove_wasm: 'prove',
  __wbg_init: 'init',
}

// Define file paths
const typeDefFile = path.resolve(
  __dirname,
  '../../examples/wasm-test-app/pkg/ezkl.d.ts',
)
const jsFile = path.resolve(
  __dirname,
  '../../examples/wasm-test-app/pkg/ezkl.js',
)

// Rename exports in both files
renameExports(typeDefFile, renameMappings)
renameExports(jsFile, renameMappings)
