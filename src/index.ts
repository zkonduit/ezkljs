import { router } from './submodules/router'

import init, {
  poseidonHash,
  // elgamalEncrypt,
  // elgamalDecrypt,
  genPk,
  genVk,
  verify,
  prove,
} from './submodules/engine/ezkl'

const engine = {
  init,
  poseidonHash,
  // elgamalEncrypt,
  // elgamalDecrypt,
  genPk,
  genVk,
  verify,
  prove,
}

export { router, engine }
export default { router, engine }
