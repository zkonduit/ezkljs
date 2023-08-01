import { Router } from './submodules/router'
import { Helper } from './submodules/helper'

import init, { 
    poseidonHash,
    elgamalEncrypt,
    elgamalDecrypt,
    genPk,
    genVk,
    verify,
    prove
} from '../examples/wasm-test-app/pkg/ezkl'

const Lib = {
    init,
    poseidonHash,
    elgamalEncrypt,
    elgamalDecrypt,
    genPk,
    genVk,
    verify,
    prove
}

export { Router, Helper, Lib }
